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

  const knex = Knex()

  const transaction = await knex.transaction()

  try {
    // Update the `moved` video with the new order value
    await knex(Tables.ListsVideos).transacting(transaction).update('order_id', newOrderIndex).where({
      list_id: listId,
      order_id: oldOrderIndex
    })

    await knex(Tables.ListsVideos)
      .transacting(transaction)
      .update({
        order_id: knex.raw(`?? ${newOrderIndex > oldOrderIndex ? '-' : '+'} 1`, ['order_id'])
      })
      .whereNot('video_id', videoId)
      .andWhere({
        list_id: listId
      })
      .andWhereBetween(
        'order_id',
        // TODO: replace this conditional with: const sorted = [newOrderIndex, oldOrderIndex].sort((a, b) => a - b)
        newOrderIndex > oldOrderIndex ? [oldOrderIndex, newOrderIndex] : [newOrderIndex, oldOrderIndex]
      )

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }

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
