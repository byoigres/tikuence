import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import User from '../../models/user.model'
import Author from '../../models/author.model'
import Video from '../../models/video.model'
import List from '../../models/list.model'

async function queryAllLists(withVideos = false) {
  return await List.findAll({
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
        required: withVideos,
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
}

/**
 * Return all lists that include at least one video
 * [httpContext = lists]
 * @param req
 * @param _res
 * @param next
 */
export async function getAllLists (req: Request, _res: Response, next: NextFunction) {
  // const lists = await queryAllLists(false)
  const page = req.query.page

  const pageSize = 10
  let offset = 0

  if (page && typeof page === 'string') {
    let parsed = parseInt(page, 10)

    if (parsed <= 0) {
      parsed = 1
    }

    offset = (parsed * pageSize) - pageSize
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

export async function getAllListsWithVideos(req: Request, _res: Response, next: NextFunction) {
  const lists = await queryAllLists(true)

  httpContext.set('lists', lists)

  next()
}

async function response (req: Request) {
  const lists: List[] = httpContext.get('lists')

  req.Inertia.setViewData({ title: 'Latest lists' }).render({
    component: 'Lists/List',
    props: {
      lists
    }
  })
}

export default [getAllLists, response]
