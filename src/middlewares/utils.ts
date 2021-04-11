import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import UrlHash from '../utils/urlHash'

export function getListIdFromHash(hash: string) {
  const listId = UrlHash.decode(hash)

  return listId
}

export async function setListIdAndHashToContext(req: Request, _res: Response, next: NextFunction) {
  const { hash } = req.params
  const listId = getListIdFromHash(hash)

  if (listId) {
    httpContext.set('hash', hash)
    httpContext.set('listId', listId)

    return next()
  }

  req.Inertia.setStatusCode(404).setViewData({ title: 'List not found' }).render({
    component: 'Errors/404'
  })
}

export async function setVideoIdAndHashToContext(req: Request, _res: Response, next: NextFunction) {
  const { videoHash } = req.params
  const videoId = getListIdFromHash(videoHash)

  httpContext.set('videoHash', videoHash)
  httpContext.set('videoId', videoId)

  next()
}
