import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import Knex, { Tables, iDetailsItem } from '../../utils/knex'

async function verifyParams(req: Request, _res: Response, next: NextFunction) {
  const pageSize = 3
  let offset = 0
  let page = 1

  if (req.headers['x-list-page'] && typeof req.headers['x-list-page'] === 'string') {
    // TODO: try-catch when `page` is not a number
    page = parseInt(req.headers['x-list-page'], 10)

    if (page <= 0) {
      page = 1
    }

    offset = page * pageSize - pageSize
  }

  httpContext.set('page', page)
  httpContext.set('pageSize', pageSize)
  httpContext.set('offset', offset)

  next()
}

async function getListVideos(req: Request, _res: Response, next: NextFunction) {
  const pageSize = httpContext.get('pageSize')
  const offset = httpContext.get('offset')
  const params = req.params

  const knex = Knex()

  const list = await knex<iDetailsItem>(`${Tables.Lists} AS L`)
    .select('L.id', 'L.title', 'U.id AS user_id')
    .join(`${Tables.Users} AS U`, 'L.user_id', 'U.id')
    .where('L.id', params.listId)
    .first()

  if (!list) {
    return req.Inertia.setStatusCode(404).setViewData({ title: 'Page not found' }).render({
      component: 'Errors/404'
    })
  }

  let fromOrderId = 0

  if (req.headers['x-list-from'] && typeof req.headers['x-list-from'] === 'string') {
    const order = await knex<{ order_id: number }>(`${Tables.ListsVideos} AS LV`)
      .select('order_id')
      .where('video_id', parseInt(req.headers['x-list-from'], 10))
      .first()

    if (order) {
      fromOrderId = order.order_id
    }
  }

  const videos = await knex(`${Tables.ListsVideos} AS LV`)
    .select('LV.video_id AS id', 'V.tiktok_id', 'V.title', 'V.html', 'LV.order_id')
    .join(`${Tables.Videos} AS V`, 'LV.video_id', 'V.id')
    .where('LV.list_id', params.listId)
    .andWhere('LV.order_id', '>=', fromOrderId)
    .orderBy('LV.order_id', 'ASC')
    .limit(pageSize)
    .offset(offset)

  httpContext.set('list', list)
  httpContext.set('videos', videos)

  next()
}

export async function getIsFavorites(req: Request, _res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    const knex = Knex()

    const isListFavorite = await knex(Tables.UsersFavorites)
      .select(knex.raw('1 AS result'))
      .where('list_id', req.params.listId)
      .andWhere('user_id', req.user ? req.user.id : 0)
      .first()

    httpContext.set('isFavorited', !!isListFavorite)

    return next()
  }

  httpContext.set('isFavorited', false)

  next()
}

async function response(req: Request) {
  const list = httpContext.get('list')
  const videos = httpContext.get('videos')
  const isFavorited : Boolean = httpContext.get('isFavorited')
  let referer = req.headers['x-page-referer']
  const flashReferer = req.flash('x-page-referer')

  if (flashReferer && flashReferer.length > 0) {
    referer = flashReferer[0]
  }

  let component = 'Feed'

  if (referer && typeof referer === 'string') {
    switch (referer) {
      case 'details':
        component = 'Lists/Details'
        break
      case 'profile':
        component = 'Profile/Profile'
        break
      default:
        component = 'Feed'
        break
    }
  }

  req.Inertia.setViewData({ title: list.title }).render({
    component,
    props: {
      list: { ...list, is_favorited: isFavorited },
      videos,
      from:
        req.headers['x-list-from'] && typeof req.headers['x-list-from'] === 'string'
          ? parseInt(req.headers['x-list-from'], 10)
          : 0,
      showModal: 'list'
    }
  })
}

export default [verifyParams, getListVideos, getIsFavorites, response]
