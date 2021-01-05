import { Request, Response, NextFunction } from 'express'
import Url from 'url'

interface iPayload {
  url: string
  listId: number
}

async function getVideoInfo (req: Request, _res: Response, next: NextFunction) {
  const payload = <iPayload>req.body

  const parsedUrl = new Url.URL(payload.url)

  if (parsedUrl.hostname !== 'www.tiktok.com') {
    return req.Inertia.setViewData({ title: 'Add new list' }).render({
      component: 'Lists/Edit',
      props: {
        message: 'Bad URL'
      }
    })
  }

  next()
}

async function createList (req: Request, _res: Response, next: NextFunction) {
  // const payload = <iPayload>req.body;

  // const video = await Video.create({
  //     title: payload.title,
  // });

  // console.log("new video", video);

  // httpContext.set("videoId", video.id);

  next()
}

function response (req: Request) {
  req.Inertia.setViewData({ title: 'Add new list' }).render({
    component: 'Lists/Edit',
    props: {}
  })
}

export default [getVideoInfo, createList, response]
