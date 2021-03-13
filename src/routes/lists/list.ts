import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import Knex, { Tables, iDetailsItem } from '../../utils/knex'

async function verifyParams(req: Request, res: Response, next: NextFunction) {
  const query = req.query
  const params = req.params
  const isInertiaRequest = req.headers['x-inertia']
  const pageSize = 3
  let offset = 0
  let page = 1

  if (query.page && typeof query.page === 'string') {
    // If a page is provided and is not an Inertia request,
    // redirect to "/" without the page query param
    if (isInertiaRequest === undefined) {
      return req.Inertia.redirect(`/list/${params.listId}`)
    }

    // TODO: try-catch when `page` is not a number
    page = parseInt(query.page, 10)

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

async function getListVideos(req: Request) {
  const pageSize = httpContext.get('pageSize')
  const offset = httpContext.get('offset')
  const query = req.query
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

  if (query.from && typeof query.from === 'string') {
    const order = await knex<{ order_id: number }>(`${Tables.ListsVideos} AS LV`)
      .select('order_id')
      .where('video_id', parseInt(query.from))
      .first()

    if (order) fromOrderId = order.order_id
  }

  const videos = await knex(`${Tables.ListsVideos} AS LV`)
    .select('LV.video_id AS id', 'V.tiktok_id', 'V.title', 'V.html', 'LV.order_id')
    .join(`${Tables.Videos} AS V`, 'LV.video_id', 'V.id')
    .where('LV.list_id', params.listId)
    .andWhere('LV.order_id', '>=', fromOrderId)
    .orderBy('LV.order_id', 'ASC')
    .limit(pageSize)
    .offset(offset)

  req.Inertia.setViewData({ title: list.title }).render({
    component: 'Feed',
    props: {
      list,
      videos,
      from: query.from || 0,
      showModal: 'list'
    }
  })
}

export default [verifyParams, getListVideos]
