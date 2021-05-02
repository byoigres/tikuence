import { Request, Response, NextFunction } from 'express'
import asyncRoutes from '../../../utils/asyncRoutes'
import { isAuthenticated } from '../../../middlewares/inertia'
import Knex, { Tables } from '../../../utils/knex'
import httpContext from 'express-http-context'
import { setListIdAndHashToContext, setVideoIdAndHashToContext } from '../../../middlewares/utils'

async function updateList(req: Request, _res: Response, next: NextFunction) {
  const listId = httpContext.get('listId')
  const videoId = httpContext.get('videoId')
  const { oldOrderIndex, newOrderIndex } = req.body

  // TODO: Add DB transaction
  const knex = Knex()

  await knex(Tables.ListsVideos).update('order_id', newOrderIndex).where({
    list_id: listId,
    order_id: oldOrderIndex
  })

  await knex(Tables.ListsVideos).update('order_id', oldOrderIndex).whereNot('video_id', videoId).andWhere({
    list_id: listId,
    order_id: newOrderIndex
  })

  next()
}

async function response(req: Request) {
  req.flash('success', 'List updated')
  req.Inertia.redirect(`/list/${req.params.hash}/details`)
}

export default asyncRoutes([
  isAuthenticated,
  setListIdAndHashToContext,
  setVideoIdAndHashToContext,
  updateList,
  response
])
