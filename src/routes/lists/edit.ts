import { Request } from 'express'
import { isAuthenticated } from '../../middlewares/inertia'
import User from '../../models/user.model'
import Author from '../../models/author.model'
import Video from '../../models/video.model'
import List from '../../models/list.model'

async function view (req: Request) {
  const userId = req.user ? req.user.id : null
  const params = req.params

  const list = await List.findOne({
    attributes: ['id', 'title'],
    where: {
      id: params.listId
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email'],
        where: {
          id: userId
        }
      },
      {
        model: Video,
        as: 'videos',
        attributes: ['id', 'title', 'thumbnail_width', 'thumbnail_height', 'thumbnail_name'],
        // The list must have videos
        required: false,
        include: [
          {
            model: Author,
            as: 'author',
            attributes: ['id', 'username']
          }
        ]
      }
    ]
  })

  if (list) {
    return req.Inertia.setViewData({ title: 'Edit list' }).render({
      component: 'Lists/Edit',
      props: {
        list
      }
    })
  }

  req.Inertia.setStatusCode(404).setViewData({ title: 'Page not found' }).render({
    component: 'Errors/404'
  })
}

export default [isAuthenticated, view]
