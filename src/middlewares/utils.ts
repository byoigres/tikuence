import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import UrlHash, { LIST_MODIFIER, VIDEO_MODIFIER } from '../utils/urlHash'

export function getListIdFromHash(hash: string) {
  const listId = UrlHash.decode(hash, LIST_MODIFIER)

  return listId
}

export function getVideoIdFromHash(hash: string) {
  const listId = UrlHash.decode(hash, VIDEO_MODIFIER)

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
  const videoId = getVideoIdFromHash(videoHash)

  if (videoId) {
    httpContext.set('videoHash', videoHash)
    httpContext.set('videoId', videoId)

    return next()
  }

  req.Inertia.setStatusCode(404).setViewData({ title: 'Page not found' }).render({
    component: 'Errors/404'
  })
}
