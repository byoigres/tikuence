import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import asyncRoutes from '../../utils/asyncRoutes'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex, { Tables } from '../../utils/knex'
import { setListIdAndHashToContext, getVideoIdFromHash } from '../../middlewares/utils'

/**
 * TODO: check if list belongs to the current user
 */

interface iPayload {
  videoId: string
}

async function updateCover(req: Request, _res: Response, next: NextFunction) {
  const listId = httpContext.get('listId')
  const body = <iPayload>req.body
  const videoId = getVideoIdFromHash(body.videoId)

  const knex = Knex()

  await knex(Tables.Lists)
    .update({
      video_cover_id: videoId
    })
    .where({
      // TODO: remove this when is validated the ownership of the list for the user
      user_id: req.user!.id,
      id: listId
    })

  next()
}

async function response(req: Request) {
  const urlHash: string = httpContext.get('hash')

  req.flash('success', 'List cover updated')

  req.Inertia.redirect(`/list/${urlHash}/details`)
}

export default asyncRoutes([
  isAuthenticated,
  setListIdAndHashToContext,
  updateCover,
  response
])
