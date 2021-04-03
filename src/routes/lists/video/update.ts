import { Request, Response, NextFunction } from 'express'
import { isAuthenticated } from '../../../middlewares/inertia'
import Knex, { Tables } from '../../../utils/knex'
import httpContext from 'express-http-context'
import { setListIdAndHashToContext } from '../../../middlewares/utils'

async function updateList(req: Request, _res: Response, next: NextFunction) {
  const listId = httpContext.get('listId')
  const { videoId } = req.params
  const { oldOrderIndex, newOrderIndex } = req.body

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

export default [isAuthenticated, setListIdAndHashToContext, updateList, response]
