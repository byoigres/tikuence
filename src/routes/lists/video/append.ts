import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import fetch from 'node-fetch'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import url from 'url'
import { checkSchema } from 'express-validator'
import { prepareValidationForErrorMessages } from '../../../middlewares/validations'
import { queryVerifyListExistsById } from '../../../queries/list'
import { isAuthenticated } from '../../../middlewares/inertia'
import { getAllLists } from '../list'
import Author from '../../../models/author.model'
import Video from '../../../models/video.model'
import ListsVideos from '../../../models/listsvideos.model'

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

const regExpPathForWeb = /^\/@[A-Za-z0-9_.]+\/video\/([0-9]+)/
const regExpPathForMobile = /^\/v\/([0-9]+).html/

const validations = checkSchema({
  listId: {
    in: 'params',
    isNumeric: {
      errorMessage: 'The provided id of the list is not valid',
      bail: true
    },
    toInt: true,
    custom: {
      // errorMessage: 'The id does not exists 1',
      options: async (value) => {
        const list = await queryVerifyListExistsById(value)
        if (!list) {
          /* eslint prefer-promise-reject-errors: 0 */
          return Promise.reject('The list does not exists 2.')
        }
      }
    }
  },
  videoUrl: {
    in: 'body',
    isLength: {
      errorMessage: 'You must provide a title for the list',
      options: {
        min: 1
        // TODO: check what is the max lenght of a complete URL
      },
      bail: true
    },
    isURL: {
      errorMessage: 'The URL is not valid',
      options: {
        require_protocol: true
      }
    }
  }
})

async function validateUrl(req: Request, _res: Response, next: NextFunction) {
  const payload = <iPayload>req.body
  const { listId } = req.params

  let parsedUrl: url.URL

  try {
    parsedUrl = new url.URL(payload.videoUrl)
  } catch (err) {
    req.flash('error', `That doesn't seems to be a valid url.`) /* eslint quotes: 0 */
    return req.Inertia.redirect(`/list/${listId}/video/add`)
  }

  // If the url.URL is a shorturl, get the "real" url by following the redirection
  if (parsedUrl.hostname === 'vm.tiktok.com') {
    const response = await fetch(payload.videoUrl)

    if (response.redirected) {
      parsedUrl = new url.URL(response.url)
    }
  }

  if (parsedUrl.hostname === 'www.tiktok.com' || parsedUrl.hostname === 'm.tiktok.com') {
    const parsedPath = parsedUrl.pathname.match(
      parsedUrl.hostname === 'www.tiktok.com' ? regExpPathForWeb : regExpPathForMobile
    )

    if (!parsedPath) {
      req.flash('error', `That doesn't seems to be a TikTok video url.URL`) /* eslint quotes: 0 */
      return req.Inertia.redirect(`/list/${listId}/video/add`)
    }

    const [, videoId] = parsedPath
    httpContext.set('videoId', videoId)
    httpContext.set('tiktokUrl', url.format(parsedUrl))

    return next()
  }

  req.flash(
    'errors',
    JSON.stringify({
      videoUrl: `That doesn't seems to be a valid TikTok video url.`
    })
  )

  return req.Inertia.redirect(`/list/${listId}/video/add`)
}

async function fetchVideoInfo(req: Request, _res: Response, next: NextFunction) {
  const videoUrl = httpContext.get('tiktokUrl')

  const response = await fetch(`https://www.tiktok.com/oembed?url=${videoUrl}`)

  const json: iTikTokOembed = await response.json()

  httpContext.set('videoInfo', json)

  next()
}

async function fetchVideoThumbnail(req: Request, _res: Response, next: NextFunction) {
  const videoInfo: iTikTokOembed = httpContext.get('videoInfo')

  const response = await fetch(videoInfo.thumbnail_url)

  const buffer = await response.buffer()

  const imageName = `${uuidv4()}.jpg`
  const imagePath = path.join(__dirname, '..', '..', '..', '..', 'public', 'images', imageName)

  await fs.writeFile(imagePath, buffer)

  httpContext.set('imageName', imageName)

  next()
}

async function extractAuthorFromUrl(req: Request, _res: Response, next: NextFunction) {
  const videoInfo: iTikTokOembed = httpContext.get('videoInfo')
  const parsedUrl = new url.URL(videoInfo.author_url)

  const authroName = parsedUrl.pathname.slice(2)

  httpContext.set('authorName', authroName)
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
  const videoInfo: iTikTokOembed = httpContext.get('videoInfo')
  const authorId = httpContext.get('authorId')

  const videoId = httpContext.get('videoId')
  const imageName = httpContext.get('imageName')

  const [video] = await Video.findOrCreate({
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
      author_id: authorId
    }
  })

  httpContext.set('videoId', video.id)

  next()
}

async function matchVideoWithList(req: Request, _res: Response, next: NextFunction) {
  const { listId } = req.params
  const videoId = httpContext.get('videoId')

  const count = await ListsVideos.count({
    where: {
      list_id: listId
    }
  })

  const values = {
    list_id: listId,
    video_id: videoId
  }
  const [, relationExists] = await ListsVideos.findOrCreate({
    where: values,
    defaults: { ...values, order_id: count + 1 }
  })

  if (!relationExists) {
    req.flash('info', 'The video you are trying to add is already on the list')
    return req.Inertia.redirect(`/list/${listId}/edit`)
  }

  next()
}

function response(req: Request) {
  const { listId } = req.params

  req.flash('success', 'Video added successfully')

  req.Inertia.redirect(`/list/${listId}/edit`)
}

export default [
  isAuthenticated,
  ...validations,
  prepareValidationForErrorMessages((req: Request) => `/list/${req.params.listId}/video/add`),
  validateUrl,
  fetchVideoInfo,
  fetchVideoThumbnail,
  extractAuthorFromUrl,
  createAuthor,
  createVideo,
  matchVideoWithList,
  getAllLists,
  response
]
