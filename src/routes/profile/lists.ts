import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import { isAuthenticated } from '../../middlewares/inertia'
import List from '../../models/list.model'
import User from '../../models/user.model'
import Author from '../../models/author.model'
import Video from '../../models/video.model'

export async function getAllLists(req: Request, _res: Response, next: NextFunction) {
  const userId = req.user ? req.user.id : null
  const page = req.query.page
  const isInertiaRequest = req.headers['x-inertia']
  const pageSize = 10
  let offset = 0

  if (page && typeof page === 'string') {
    // If a page is provided and is not an Inertia request,
    // redirect to "/" without the page query param
    if (isInertiaRequest === undefined) {
      return req.Inertia.redirect('/')
    }

    let parsed = parseInt(page, 10)

    if (parsed <= 0) {
      parsed = 1
    }

    offset = parsed * pageSize - pageSize
  }

  const lists = await List.findAll({
    attributes: ['id', 'title', 'updated_at'],
    limit: pageSize,
    offset,
    order: [['updated_at', 'DESC']],
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
        required: true,
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

  httpContext.set('lists', lists)

  next()
}

async function response(req: Request) {
  const lists: List[] = httpContext.get('lists')

  req.Inertia.setViewData({ title: 'My lists' }).render({
    component: 'Profile/Lists',
    props: {
      lists
    }
  })
}

export default [isAuthenticated, getAllLists, response]
