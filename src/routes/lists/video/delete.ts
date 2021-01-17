import { Request, Response, NextFunction } from 'express'
import { isAuthenticated } from '../../../middlewares/inertia'
import ListsVideos from '../../../models/listsvideos.model'

async function deleteList(req: Request, _res: Response, next: NextFunction) {
  const { listId, videoId } = req.params

  await ListsVideos.destroy({
    where: {
      list_id: listId,
      video_id: videoId
    }
  })

  next()
}

async function response(req: Request) {
  const { listId } = req.params

  req.flash('success', 'Video removed successfully')
  req.Inertia.redirect(`/list/${listId}/edit`)
}

export default [isAuthenticated, deleteList, response]
