import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import Url from 'url'
import { getAllLists } from './list'
import List from '../../models/list.model'

interface iPayload {
  url: string
  listId: number
}

const pathRegExp = /^\/@[A-Za-z0-9_]+\/video\/[0-9]+/

async function validatePayload(req: Request, _res: Response, next: NextFunction) {
  const payload = <iPayload>req.body
  // const params = req.params

  const parsedUrl = new Url.URL(payload.url)

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

export default [validatePayload, createList, getAllLists, response]
