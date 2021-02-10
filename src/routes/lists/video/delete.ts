import { Request, Response, NextFunction } from 'express'
import { literal, Op } from 'sequelize'
import { isAuthenticated } from '../../../middlewares/inertia'
import ListsVideos from '../../../models/listsvideos.model'
import List from '../../../models/list.model'
import Video from '../../../models/video.model'

async function verifyListBelongsToCurrentUser(req: Request, _res: Response, next: NextFunction) {
  const { listId, videoId } = req.params

  // TODO: Verify separately the video exists and then it belongs to the user

  const list = await List.findOne({
    where: {
      id: listId,
      user_id: req.user?.id ?? 0
    },
    include: [
      {
        model: Video,
        through: {
          where: {
            video_id: videoId
          }
        }
      }
    ]
  })

  if (!list) {
    req.flash('warning', 'The video can not be deleted')

    req.Inertia.redirect(`/list/${listId}/edit`)
  }

  next()
}

async function deleteList(req: Request, _res: Response, next: NextFunction) {
  const { listId, videoId } = req.params

  // Find the current item to delete
  const item = await ListsVideos.findOne({
    where: {
      /**
       * TODO: check if list belongs to the current user
       */
      list_id: listId,
      video_id: videoId
    }
  })

  if (item) {
    // Delete the video
    await ListsVideos.destroy({
      where: {
        list_id: listId,
        video_id: videoId
      }
    })

    // Update the order id of subsecuent videos
    await ListsVideos.update(
      {
        order_id: literal('order_id - 1')
      },
      {
        where: {
          list_id: listId,
          order_id: {
            [Op.gt]: item.order_id
          }
        }
      }
    )

    next()
  }

  req.flash('error', 'The video you want to delete not exists.')
  req.Inertia.redirect(`/list/${listId}/edit`)
}

async function response(req: Request) {
  const { listId } = req.params

  req.flash('success', 'Video removed successfully')
  req.Inertia.redirect(`/list/${listId}/edit`)
}

export default [isAuthenticated, verifyListBelongsToCurrentUser, deleteList, response]
