import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import asyncRoutes from '../utils/asyncRoutes'
import Knex, { Tables, iFeedResult } from '../utils/knex'
import { createThumbnailsUrl } from '../utils/images'

// TODO: validate headers

async function verifyParams(req: Request, res: Response, next: NextFunction) {
  let category = req.headers['x-feed-category']
  const pageSize = 24
  let offset = 0
  let page = 1

  if (typeof category !== 'string') {
    category = 'recent'
  }

  if (req.headers['x-feed-page'] && typeof req.headers['x-feed-page'] === 'string') {
    // TODO: try-catch when `page` is not a number
    page = parseInt(req.headers['x-feed-page'], 10)

    if (page <= 0) {
      page = 1
    }

    offset = page * pageSize - pageSize
  }

  httpContext.set('category', category)
  httpContext.set('offset', offset)
  // httpContext.set('orderType', orderType)

  next()
}

async function getAllLists(req: Request, _res: Response, next: NextFunction) {
  const category = httpContext.get('category')
  const offset = httpContext.get('offset')
  const pageSize = 24

  const knex = Knex()

  const lists = await knex<[iFeedResult]>(`${Tables.Lists} as L`)
    .select<[iFeedResult]>(
      'L.url_hash AS id',
      'L.title',
      'VT.thumbnail_name as thumbnail',
      'U.username',
      'VTO.total as total_videos'
    )
    .joinRaw(
      `JOIN LATERAL (${knex
        .select('V.thumbnail_name')
        .from(`${Tables.Videos} AS V`)
        .whereRaw('"V"."id" = "L"."video_cover_id"')
        .limit(1)}) AS "VT" ON TRUE`
    )
    .joinRaw(
      `JOIN LATERAL (${knex
        .select(
          'V.created_at',
          knex(`${Tables.ListsVideos} AS ILV`).count('*').whereRaw('"ILV"."list_id" = "L"."id"').as('total')
        )
        .from(`${Tables.ListsVideos} AS LV`)
        .join(`${Tables.Videos} AS V`, 'LV.video_id', 'V.id')
        .whereRaw('"LV"."list_id" = "L"."id"')
        .orderBy('V.created_at', 'DESC')
        .limit(1)}) AS "VTO" ON TRUE`
    )
    .join(`${Tables.Users} AS U`, 'L.user_id', 'U.id')
    .where('VTO.total', '>', category === 'recent' ? 3 : 0)
    .orderBy(category === 'recent' ? 'VTO.created_at' : 'L.created_at', 'DESC')
    .limit(pageSize)
    .offset(offset)

  lists.forEach((item) => {
    item.thumbnails = createThumbnailsUrl(item.thumbnail)
  })

  httpContext.set('lists', lists)

  next()
}

async function response(req: Request) {
  const category = httpContext.get('category')
  const lists = httpContext.get('lists')

  req.Inertia.setViewData({ title: 'Recent lists' }).render({
    component: 'Feed',
    props: {
      category,
      lists,
      modal: false
    }
  })
}

export default asyncRoutes([verifyParams, getAllLists, response])
