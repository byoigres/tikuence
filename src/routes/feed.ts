import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import asyncRoutes from '../utils/asyncRoutes'
import Knex, { Tables, iFeedResult } from '../utils/knex'

async function verifyParams(req: Request, res: Response, next: NextFunction) {
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
  httpContext.set('offset', offset)
  httpContext.set('orderType', orderType)

  next()
}

async function getAllLists(req: Request, _res: Response, next: NextFunction) {
  const category = httpContext.get('category')
  const offset = httpContext.get('offset')
  const pageSize = 10

  const knex = Knex()

  const lists = await knex<iFeedResult>(`${Tables.Lists} as L`)
    .select<iFeedResult>('L.id', 'L.title', 'VT.thumbnail_name as thumbnail', 'U.email', 'VT.total as total_videos')
    .joinRaw(
      `JOIN LATERAL (${knex
        .select(
          'V.id',
          'V.thumbnail_name',
          'V.created_at',
          knex(`${Tables.ListsVideos} AS ILV`).count('*').whereRaw('"ILV"."list_id" = "L"."id"').as('total')
        )
        .from(`${Tables.ListsVideos} AS LV`)
        .join(`${Tables.Videos} AS V`, 'LV.video_id', 'V.id')
        .whereRaw('"LV"."list_id" = "L"."id"')
        .orderBy('V.created_at', 'DESC')
        .limit(1)}) AS "VT" ON TRUE`
    )
    .join(`${Tables.Users} AS U`, 'L.user_id', 'U.id')
    .orderBy(category === 'recent' ? 'VT.created_at' : 'L.created_at', 'DESC')
    .limit(pageSize)
    .offset(offset)

  httpContext.set('lists', lists)

  next()
}

async function response(req: Request) {
  const category = httpContext.get('category')
  const lists = httpContext.get('lists')

  req.Inertia.setViewData({ title: 'Latest lists' }).render({
    component: 'Lists/List',
    props: {
      category,
      lists
    }
  })
}

export default asyncRoutes([verifyParams, getAllLists, response])
