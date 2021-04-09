import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex, { Tables, iProfileList } from '../../utils/knex'

export async function getAllLists(req: Request, _res: Response, next: NextFunction) {
  const userId = req.user ? req.user.id : null
  const page = req.query.page
  const isInertiaRequest = req.headers['x-inertia']
  // const pageSize = 10
  // let offset = 0

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

    // offset = parsed * pageSize - pageSize
  }

  const knex = Knex()

  const lists = await knex<iProfileList>(`${Tables.Lists} as L`)
    .select(
      'L.id',
      'L.title',
      'VT.thumbnail_name as thumbnail',
      knex.raw('CASE WHEN "VT"."total" IS NULL THEN 0 ELSE "VT"."total" END AS "total_videos"')
    )
    .joinRaw(
      `LEFT JOIN LATERAL (${knex
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
    .where('L.user_id', userId)
    .orderBy('L.created_at', 'DESC')

  httpContext.set('lists', lists)

  next()
}

async function response(req: Request) {
  const lists: iProfileList[] = httpContext.get('lists')

  req.Inertia.setViewData({ title: 'My lists' }).render({
    component: 'Profile/Lists',
    props: {
      lists
    }
  })
}

export default [isAuthenticated, getAllLists, response]
