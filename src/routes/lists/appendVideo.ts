import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import Url from 'url'
import fetch from 'node-fetch'
import { getAllLists } from './list'
import List from '../../models/list.model'

interface iPayload {
  videoUrl: string
  listId: number
}

const pathRegExp = /^\/@[A-Za-z0-9_]+\/video\/[0-9]+/

async function validatePayload(req: Request, _res: Response, next: NextFunction) {
  const payload = <iPayload>req.body
  const params = req.params
  const query = req.query

  console.log('req.path', req.path)
  console.log('req.query', req.query)

  if (payload.videoUrl.length === 0) {
    req.flash(
      'errors',
      JSON.stringify({
        videoUrl: 'This field is required'
      })
    )

    return req.Inertia.redirect(
      `/list/${params.listId}/video/add?returnUrl=${encodeURIComponent(query.returnUrl ? query.returnUrl as string: '')}`)
  }

  const parsedUrl = new Url.URL(payload.videoUrl)

  console.log(parsedUrl)

  if (parsedUrl.hostname !== 'www.tiktok.com' && pathRegExp.test(parsedUrl.pathname)) {
    return req.Inertia.setViewData({ title: 'Add new list' }).render({
      component: 'Lists/Edit',
      props: {
        message: 'Bad URL'
      }
    })
  }

  next()
}

async function fetchVideoInfo(req: Request, _res: Response, next: NextFunction) {
  const payload = <iPayload>req.body

  const response = await fetch(payload.videoUrl)

  const json = await response.json();

  httpContext.set('videoInfo', json)

  next()
}

async function fetchVideoThumbnail(req: Request, _res: Response, next: NextFunction) {
  const videoInfo = httpContext.get('videoInfo')

  const response = await fetch(videoInfo.thumbnail_url)

  const buffer = await response.buffer();

  next()
}

async function createList(req: Request, _res: Response, next: NextFunction) {
  // const payload = <iPayload>req.body;

  // const video = await Video.create({
  //     title: payload.title,
  // });

  // console.log("new video", video);

  // httpContext.set("videoId", video.id);

  next()
}

function response(req: Request) {
  const lists: List[] = httpContext.get('lists')

  req.Inertia.setViewData({ title: 'Add new list' }).render({
    component: 'Lists/Edit',
    props: {
      lists
    }
  })
}

export default [
  validatePayload,
  fetchVideoInfo,
  fetchVideoThumbnail,
  createList, 
  getAllLists,
  response
]
