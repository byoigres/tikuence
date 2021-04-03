import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import UrlHash from '../utils/urlHash'

export function getListIdFromHash(hash: string) {
  const [listId] = UrlHash.decode(hash)

  return listId
}

export async function setListIdAndHashToContext(req: Request, _res: Response, next: NextFunction) {
  const { hash } = req.params
  const listId = getListIdFromHash(hash)

  httpContext.set('hash', hash)
  httpContext.set('listId', listId)

  next()
}
