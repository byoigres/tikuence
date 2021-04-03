import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import asyncRoutes from '../../utils/asyncRoutes'
import Knex, { Tables } from '../../utils/knex'

async function verifyParams(req: Request, res: Response, next: NextFunction) {
  let category = req.headers['x-profile-category'] || req.query.tab
  const pageSize = 16
  let offset = 0
  let page = 1

  if (typeof category !== 'string') {
    category = 'lists'
  }

  if (req.headers['x-profile-page'] && typeof req.headers['x-profile-page'] === 'string') {
    // TODO: try-catch when `page` is not a number
    page = parseInt(req.headers['x-profile-page'], 10)

    if (page <= 0) {
      page = 1
    }

    offset = page * pageSize - pageSize
  }

  httpContext.set('category', category)
  httpContext.set('page', page)
  httpContext.set('pageSize', pageSize)
  httpContext.set('offset', offset)

  next()
}

async function verifyUser(req: Request, res: Response, next: NextFunction) {
  const params = req.params
  const knex = Knex()

  const fields: string[] = ['id', 'name', 'username', 'biography', 'tiktok_username', 'profile_picture_url AS picture']

  if (req.isAuthenticated()) {
    fields.push('email')
  }

  const user = await knex(Tables.Users)
    .select(...fields)
    .where('username', params.username)
    .first()

  if (!user) {
    return req.Inertia.setStatusCode(404).setViewData({ title: 'Page not found' }).render({
      component: 'Errors/404'
    })
  }

  httpContext.set('user', { ...user, tiktok_url: `https://www.tiktok.com/@${user.tiktok_username}` })

  next()
}

async function getAllListsFromUser(req: Request, res: Response, next: NextFunction) {
  const category = httpContext.get('category')
  const pageSize = httpContext.get('pageSize')
  const offset = httpContext.get('offset')
  const knex = Knex()
  const user = httpContext.get('user')
  const isMe = req.isAuthenticated() && req.params.username === req.user.username

  let query = knex(`${Tables.Lists} as L`)
    .select(
      'L.url_hash AS id',
      'L.title',
      'VT.thumbnail_name as thumbnail',
      'U.email',
      knex.raw('COALESCE("VT"."total", 0) as "total_videos"')
    )
    .joinRaw(
      `${isMe ? 'LEFT' : ''} JOIN LATERAL (${knex
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

  if (category === 'lists') {
    query = query.join(`${Tables.Users} AS U`, 'L.user_id', 'U.id')
  } else { // favorites
    query = query
      .join(`${Tables.UsersFavorites} AS UF`, 'L.id', 'UF.list_id')
      .join(`${Tables.Users} AS U`, 'UF.user_id', 'U.id')
  }

  const lists = await query.where('U.id', user.id).orderBy('VT.created_at', 'DESC').limit(pageSize).offset(offset)

  httpContext.set('lists', lists)
  httpContext.set('isMe', isMe)

  next()
}

async function response(req: Request) {
  const category = httpContext.get('category')
  const lists = httpContext.get('lists')
  const user = httpContext.get('user')
  const isMe = httpContext.get('isMe')

  req.Inertia.setViewData({ title: 'My Profile' }).render({
    component: 'Profile/Profile',
    props: {
      user,
      isMe,
      lists,
      category,
      modal: {
        modalName: false
      }
    }
  })
}

export default asyncRoutes([verifyParams, verifyUser, getAllListsFromUser, response])
