import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import asyncRoutes from '../../../utils/asyncRoutes'
import { isAuthenticated } from '../../../middlewares/inertia'
import Knex, { Tables, iListVideo } from '../../../utils/knex'
import { setListIdAndHashToContext, setVideoIdAndHashToContext } from '../../../middlewares/utils'

async function verifyListBelongsToCurrentUser(req: Request, _res: Response, next: NextFunction) {
  const listId = httpContext.get('listId')
  const videoId = httpContext.get('videoId')

  // TODO: Verify separately the video exists and then it belongs to the user
  const knex = Knex()

  const list = await knex<iListVideo>(`${Tables.Lists} AS L`)
    .select('L.id', 'LV.order_id', 'L.video_cover_id')
    .join(`${Tables.ListsVideos} AS LV`, 'L.id', 'LV.list_id')
    .where({
      'L.id': listId,
      'L.user_id': req.user!.id,
      'LV.video_id': videoId
    })
    .first()

  if (!list) {
    req.flash('warning', 'The video can not be deleted')

    return req.Inertia.redirect(`/list/${req.params.hash}/details`)
  }

  httpContext.set('order_id', list.order_id)
  httpContext.set('video_cover_id', list.video_cover_id)

  next()
}

async function deleteList(req: Request, _res: Response, next: NextFunction) {
  const listId = httpContext.get('listId')
  const videoId = httpContext.get('videoId')
  const orderId = httpContext.get('order_id')
  const coverId = httpContext.get('video_cover_id')

  const knex = Knex()

  const transaction = await knex.transaction()

  try {
    // Delete the video
    await knex(Tables.ListsVideos)
      .transacting(transaction)
      .where({
        list_id: listId,
        video_id: videoId
      })
      .delete()

    const counter = await knex<number>(Tables.ListsVideos)
      .transacting(transaction)
      .count('video_id', { as: 'total' })
      .where('list_id', listId)
      .first<{ total: number }>()

    // TODO: fix this validation to be more direct
    let newCoverId: { video_id?: number } = { video_id: undefined }

    if (counter.total > 0) {
      // Update the order id
      await knex(Tables.ListsVideos)
        .transacting(transaction)
        .update({
          order_id: knex.raw('?? - 1', ['order_id'])
        })
        .where('list_id', listId)
        .andWhere('order_id', '>', orderId)

      if (coverId === videoId) {
        // Select the first video from the list to set as cover
        newCoverId = await knex<number>(Tables.ListsVideos)
          .transacting(transaction)
          .select('video_id')
          .where('list_id', listId)
          .first<{ video_id: number }>()
      }
    }
    // TODO: find a way to not repeat the same if (coverId === videoId) from above
    if (coverId === videoId) {
      await knex(Tables.Lists)
        .transacting(transaction)
        .update({
          video_cover_id: newCoverId.video_id ? newCoverId.video_id : null
        })
        .where('id', listId)
    }

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }

  next()
}

async function response(req: Request) {
  const urlHash: string = httpContext.get('hash')
  req.flash('success', 'Video removed successfully')
  req.Inertia.redirect(`/list/${urlHash}/details`)
}

export default asyncRoutes([
  isAuthenticated,
  setListIdAndHashToContext,
  setVideoIdAndHashToContext,
  verifyListBelongsToCurrentUser,
  deleteList,
  response
])
