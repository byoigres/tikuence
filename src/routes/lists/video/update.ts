import { Request, Response, NextFunction } from 'express'
import { isAuthenticated } from '../../../middlewares/inertia'
import Knex from '../../../utils/knex'

async function updateList(req: Request, _res: Response, next: NextFunction) {
  const { listId, videoId } = req.params
  const { oldOrderIndex, newOrderIndex } = req.body

  const knex = Knex()

  await knex('public.lists_videos').update('order_id', newOrderIndex).where({
    list_id: listId,
    order_id: oldOrderIndex
  })

  await knex('public.lists_videos').update('order_id', oldOrderIndex).whereNot('video_id', videoId).andWhere({
    list_id: listId,
    order_id: newOrderIndex
  })

  // await ListsVideos.update(
  //   {
  //     order_id: newOrderIndex
  //   },
  //   {
  //     where: {
  //       list_id: listId,
  //       order_id: oldOrderIndex
  //     }
  //   }
  // )

  // await ListsVideos.update(
  //   {
  //     order_id: oldOrderIndex
  //   },
  //   {
  //     where: {
  //       list_id: listId,
  //       video_id: {
  //         [Op.not]: videoId
  //       },
  //       order_id: newOrderIndex
  //     }
  //   }
  // )

  next()
}

async function response(req: Request) {
  const { listId } = req.params

  req.flash('success', 'List updated')
  req.Inertia.redirect(`/list/${listId}/edit`)
}

export default [isAuthenticated, updateList, response]
