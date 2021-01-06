import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import User from '../../models/user.model'
import Author from '../../models/author.model'
import Video from '../../models/video.model'
import List from '../../models/list.model'

/**
 * Return all lists that include at least one video
 * [httpContext = lists]
 * @param req 
 * @param _res 
 * @param next 
 */
export async function getLists (req: Request, _res: Response, next: NextFunction) {
  const lists = await List.findAll({
    attributes: ['id', 'title'],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email']
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

async function response (req: Request) {
  const lists: List[] = httpContext.get('lists')

  req.Inertia.setViewData({ title: 'Counter events' }).render({
    component: 'Lists/List',
    props: {
      lists
    }
  })
}

export default [getLists, response]
