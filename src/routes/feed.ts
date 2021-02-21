import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import Sequelize from 'sequelize'
import User from '../models/user.model'
import Video from '../models/video.model'
import List from '../models/list.model'
import ListsVideos from '@models/listsvideos.model'

function verifyParams(req: Request, res: Response, next: NextFunction) {
  const params = req.params
  const query = req.query

  let category = params.category
  let orderType = 'week'
  const isInertiaRequest = req.headers['x-inertia']
  const pageSize = 10
  let offset = 0
  let page = 1

  if (typeof category !== 'string') {
    category = 'recent'
  }

  if (params.page && typeof params.page === 'string') {
    // If a page is provided and is not an Inertia request,
    // redirect to "/" without the page query param
    if (isInertiaRequest === undefined) {
      return req.Inertia.redirect(`/feed/${category}`)
    }

    if (typeof query.t === 'string') {
      // TODO: try-catch when `t` is not a number
      orderType = query.t
    }

    // TODO: try-catch when `page` is not a number
    page = parseInt(params.page, 10)

    if (page <= 0) {
      page = 1
    }

    offset = page * pageSize - pageSize
  }

  httpContext.set('category', category)
  httpContext.set('page', page)
  httpContext.set('offset', offset)
  httpContext.set('orderType', orderType)

  next()
}

async function getAllLists(req: Request, _res: Response, next: NextFunction) {
  const category = httpContext.get('category')
  // const page = httpContext.get('page')
  const offset = httpContext.get('offset')
  // const orderType = httpContext.get('orderType')
  const pageSize = 10

  function getOrderField(c: string): string {
    switch (c) {
      case 'recent':
        return 'last_added_video_at'
      default:
        return 'created_at'
    }
  }

  const lists = await List.findAll({
    attributes: ['id', 'title', 'created_at', 'last_added_video_at'],
    limit: pageSize,
    offset,
    order: [[getOrderField(category), 'DESC']],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email']
      },
      {
        model: Video,
        as: 'videos',
        attributes: ['id', 'title', 'thumbnail_name', 'updated_at'],
        // The list must have videos
        order: [['updated_at', 'DESC']],
        required: true,
        through: {
          attributes: ['order_id'],
          where: {
            // Get just the first video
            order_id: 1
          }
        }
      }
    ]
    // raw: true,
    // plain: true,
    // nest: true
  })

  const listsVideosCount = await ListsVideos.findAll({
    // attributes: ['list_id', Sequelize.fn('COUNT', Sequelize.col('Answers.familyId'))]],
    attributes: [
      ['list_id', 'id'],
      [Sequelize.fn('COUNT', Sequelize.col('list_id')), 'videos']
    ],
    where: {
      list_id: lists.map((x) => x.id)
    },
    group: 'list_id'
  })

  const result = lists.map((list) => {
    const listVideosCount = listsVideosCount.find((lc) => lc.id === list.id)
    let count = 0

    if (listVideosCount) {
      const plain: { id?: number; videos?: number } = listVideosCount.get({ plain: true })

      if (plain.videos) {
        count = plain.videos
      }
    }

    return {
      id: list.id,
      title: list.title,
      author: list.user,
      thumbnail: list.videos[0].thumbnail_name,
      videos: count
    }
  })

  console.log(result)

  // Project.findAll({
  //   attributes: ['User.username', [sequelize.fn('COUNT', sequelize.col('Project.id')), 'ProjectCount']],
  //   include: [
  //     {
  //       model: User,
  //       attributes: [],
  //       include: []
  //     }
  //   ],
  //   group: ['User.username'],
  //   raw: true
  // })

  httpContext.set('lists', lists)

  next()
}

async function response(req: Request) {
  const category = httpContext.get('category')
  const lists: List[] = httpContext.get('lists')

  req.Inertia.setViewData({ title: 'Latest lists' }).render({
    component: 'Lists/List',
    props: {
      category,
      lists
    }
  })
}

export default [verifyParams, getAllLists, response]
