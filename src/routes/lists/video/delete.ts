import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import { isAuthenticated } from '../../../middlewares/inertia'
import Knex, { iListVideo } from '../../../utils/knex'

async function verifyListBelongsToCurrentUser(req: Request, _res: Response, next: NextFunction) {
  const { listId, videoId } = req.params

  // TODO: Verify separately the video exists and then it belongs to the user
  const knex = Knex()

  const list = await knex<iListVideo>('public.lists AS L')
    .select('L.id', 'LV.order_id')
    .join('public.lists_videos AS LV', 'L.id', 'LV.list_id')
    .where({
      'L.id': listId,
      'L.user_id': req.user?.id ?? 0,
      'LV.video_id': videoId
    })
    .first()

  if (!list) {
    req.flash('warning', 'The video can not be deleted')

    req.Inertia.redirect(`/list/${listId}/edit`)
  }

  httpContext.set('order_id', list.order_id)

  next()
}

async function deleteList(req: Request, _res: Response, next: NextFunction) {
  const { listId, videoId } = req.params
  const orderId = httpContext.get('order_id')

  const knex = Knex()

  // Delete the video
  await knex('public.lists_videos').where({
    list_id: listId,
    video_id: videoId
  }).delete()

  // Update the order id
  await knex('public.lists_videos')
    .update({
      order_id: knex.raw('?? - 1', ['order_id'])
    })
    .where('list_id', listId)
    .andWhere('order_id', '>', orderId)

  next()
}

async function response(req: Request) {
  const { listId } = req.params

  req.flash('success', 'Video removed successfully')
  req.Inertia.redirect(`/list/${listId}/edit`)
}

export default [isAuthenticated, verifyListBelongsToCurrentUser, deleteList, response]
