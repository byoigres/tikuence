import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import Url from 'url'
import fetch from 'node-fetch'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { getAllLists } from './list'
import Author from '../../models/author.model'
import Video from '../../models/video.model'
import ListsVideos from '../../models/listsvideos.model'

interface iPayload {
  videoUrl: string
  listId: number
}

interface iTikTokOembed {
  version: string
  type: string
  title: string
  // eslint-disable-next-line camelcase
  author_url: string
  // eslint-disable-next-line camelcase
  author_name: string
  width: string
  height: string
  html: string
  // eslint-disable-next-line camelcase
  thumbnail_width: number
  // eslint-disable-next-line camelcase
  thumbnail_height: number
  // eslint-disable-next-line camelcase
  thumbnail_url: string
  // eslint-disable-next-line camelcase
  provider_url: string
  // eslint-disable-next-line camelcase
  provider_name: string
}

// const pathRegExp = /^\/@[A-Za-z0-9_]+\/video\/[0-9]+/
const pathRegExp = /^\/@([A-Za-z0-9_.]+)\/video\/([0-9]+)/

async function validatePayload(req: Request, _res: Response, next: NextFunction) {
  const payload = <iPayload>req.body
  const params = req.params

  if (payload.videoUrl.length === 0) {
    req.flash(
      'errors',
      JSON.stringify({
        videoUrl: 'This field is required'
      })
    )

    req.Inertia.redirect(`/list/${params.listId}/video/add${req.returnUrl()}`)
  }

  const parsedUrl = new Url.URL(payload.videoUrl)

  const parsedPath = parsedUrl.pathname.match(pathRegExp)

  if (parsedUrl.hostname !== 'www.tiktok.com' || parsedPath === null) {
    return req.Inertia.setViewData({ title: 'Add new list' }).render({
      component: 'Lists/Edit',
      props: {
        message: 'Bad URL'
      }
    })
  }

  const authorName = parsedPath[1].toString()
  const videoId = parsedPath[2].toString()

  httpContext.set('authorName', authorName)
  httpContext.set('videoId', videoId)

  next()
}

async function fetchVideoInfo(req: Request, _res: Response, next: NextFunction) {
  const payload = <iPayload>req.body

  const response = await fetch(`https://www.tiktok.com/oembed?url=${payload.videoUrl}`)

  const json : iTikTokOembed = await response.json()

  httpContext.set('videoInfo', json)

  next()
}

async function fetchVideoThumbnail(req: Request, _res: Response, next: NextFunction) {
  const videoInfo: iTikTokOembed = httpContext.get('videoInfo')

  const response = await fetch(videoInfo.thumbnail_url)

  const buffer = await response.buffer()

  const imageName = `${uuidv4()}.jpg`
  const imagePath = path.join(__dirname, '..', '..', '..', 'public', 'images', imageName)

  await fs.writeFile(imagePath, buffer)

  httpContext.set('imageName', imageName)

  next()
}

async function createAuthor(req: Request, _res: Response, next: NextFunction) {
  const videoInfo: iTikTokOembed = httpContext.get('videoInfo')
  const authorName: string = httpContext.get('authorName')

  const [author] = await Author.findOrCreate({
    where: {
      username: authorName
    },
    defaults: {
      username: authorName,
      name: videoInfo.author_name
    }
  })

  httpContext.set('authorId', author.id)

  next()
}

async function createVideo(req: Request, _res: Response, next: NextFunction) {
  const { listId } = req.params
  const videoInfo: iTikTokOembed = httpContext.get('videoInfo')
  const authorId = httpContext.get('authorId')

  const videoId = httpContext.get('videoId')
  const imageName = httpContext.get('imageName')

  const [video, alreadyExists] = await Video.findOrCreate({
    where: {
      tiktok_id: videoId
    },
    defaults: {
      tiktok_id: videoId,
      title: videoInfo.title,
      html: videoInfo.html,
      thumbnail_width: videoInfo.thumbnail_width,
      thumbnail_height: videoInfo.thumbnail_height,
      thumbnail_name: imageName,
      author: authorId
    }
  })

  if (!alreadyExists) {
    req.flash('info', 'The video you are trying to add is already on the list')
    return req.Inertia.redirect(`/list/${listId}/edit${req.returnUrl()}`)
  }

  console.log('new video', video)
  console.log('boolean', alreadyExists)

  httpContext.set('videoId', video.id)

  next()
}

async function matchVideoWithList(req: Request, _res: Response, next: NextFunction) {
  const { listId } = req.params
  const videoId = httpContext.get('videoId')

  await ListsVideos.create({
    list_id: listId,
    video_id: videoId
  })

  next()
}

function response(req: Request) {
  const { listId } = req.params

  req.Inertia.redirect(`/list/${listId}/edit${req.returnUrl()}`)
}

export default [
  validatePayload,
  fetchVideoInfo,
  fetchVideoThumbnail,
  createAuthor,
  createVideo,
  matchVideoWithList,
  getAllLists,
  response
]
