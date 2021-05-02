import { Request } from 'express'
import httpContext from 'express-http-context'
import asyncRoutes from '../../utils/asyncRoutes'
import Knex, { Tables, iProfileListVideos } from '../../utils/knex'
import { setListIdAndHashToContext } from '../../middlewares/utils'
import { getIsFavorites } from '../lists/list'
import { createThumbnailUrl, ThumbnailSize } from '../../utils/images'

async function view(req: Request) {
  const listId = httpContext.get('listId')
  const isFavorited: Boolean = httpContext.get('isFavorited')

  const knex = Knex()

  const list = await knex(`${Tables.Lists} AS L`)
    .select(
      'L.url_hash AS id',
      'L.title',
      'L.user_id',
      'U.name',
      'U.username',
      'U.profile_picture_url AS picture',
      'VT.thumbnail_name AS thumbnail',
      'VT.total AS total_videos'
    )
    .join(`${Tables.Users} AS U`, 'L.user_id', 'U.id')
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
    .where({ 'L.id': listId })
    .first()

  if (list) {
    list.thumbnail = createThumbnailUrl(list.thumbnail, ThumbnailSize.Lg)

    const videos = await knex<iProfileListVideos>(`${Tables.ListsVideos} AS LV`)
      .select('V.url_hash AS id', 'V.title', 'V.thumbnail_name AS thumbnail', 'LV.order_id')
      .join(`${Tables.Videos} AS V`, 'LV.video_id', 'V.id')
      .where('LV.list_id', listId)
      .orderBy('LV.order_id')

    videos.forEach((item) => {
      item.thumbnail = createThumbnailUrl(item.thumbnail, ThumbnailSize.Sm)
    })

    return req.Inertia.setViewData({ title: list.title, thumbnail: list.thumbnail }).render({
      component: 'Lists/Details',
      props: {
        id: list.id,
        title: list.title,
        total_videos: list.total_videos || 0,
        isFavorited,
        user: {
          id: list.user_id,
          name: list.name,
          username: list.username,
          picture: list.picture
        },
        videos: videos,
        isMe: req.user ? req.user.id === list.user_id : false,
        modal: false
      }
    })
  }

  req.Inertia.setStatusCode(404).setViewData({ title: 'Page not found' }).render({
    component: 'Errors/404'
  })
}

export default asyncRoutes([
  setListIdAndHashToContext,
  getIsFavorites,
  view
])
