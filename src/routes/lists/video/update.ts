import { Request, Response, NextFunction } from 'express'
import { Op } from 'sequelize'
import { isAuthenticated } from '../../../middlewares/inertia'
import ListsVideos from '../../../models/listsvideos.model'

async function updateList(req: Request, _res: Response, next: NextFunction) {
  const { listId, videoId } = req.params
  const { oldOrderIndex, newOrderIndex } = req.body

  await ListsVideos.update(
    {
      order_id: newOrderIndex
    },
    {
      where: {
        list_id: listId,
        order_id: oldOrderIndex
      }
    }
  )

  await ListsVideos.update(
    {
      order_id: oldOrderIndex
    },
    {
      where: {
        list_id: listId,
        video_id: {
          [Op.not]: videoId
        },
        order_id: newOrderIndex
      }
    }
  )

  next()
}

async function response(req: Request) {
  const { listId } = req.params

  req.flash('success', 'List updated')
  req.Inertia.redirect(`/list/${listId}/edit`)
}

export default [isAuthenticated, updateList, response]
