import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import asyncRoutes from '../../utils/asyncRoutes'
import Knex, { Tables, iProfileListVideos } from '../../utils/knex'
import { setListIdAndHashToContext } from '../../middlewares/utils'
import { getIsFavorites } from '../lists/list'
import { createThumbnailUrl, ThumbnailSize } from '../../utils/images'
import UrlHash, { VIDEO_MODIFIER } from '../../utils/urlHash'

async function getList(req: Request, res: Response, next: NextFunction) {
  const listId = httpContext.get('listId')
  const knex = Knex()

  const list = await knex(`${Tables.Lists} AS L`)
    .select(
      'L.url_hash AS id',
      'L.title',
      'L.user_id',
      'L.video_cover_id',
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

  if (!list) {
    return req.Inertia.setStatusCode(404).setViewData({ title: 'Page not found' }).render({
      component: 'Errors/404'
    })
  }

  httpContext.set('list', list)

  next()
}

async function getAuthors(req: Request, res: Response, next: NextFunction) {
  const listId = httpContext.get('listId')

  const knex = Knex()

  const authors = await knex(`${Tables.ListsVideos} AS LV`)
    .select('A.name', 'A.username')
    .join(`${Tables.Videos} AS V`, 'LV.video_id', 'V.id')
    .join(`${Tables.Authors} AS A`, 'V.author_id', 'A.id')
    .where('LV.list_id', listId)
    .groupBy('A.name', 'A.username')
    .orderBy('A.username')

  httpContext.set('authors', authors)

  next()
}

async function setThumbnails(req: Request, res: Response, next: NextFunction) {
  const listId = httpContext.get('listId')
  const list = httpContext.get('list')

  const knex = Knex()

  list.thumbnail = createThumbnailUrl(list.thumbnail, ThumbnailSize.Lg)

  const videos = await knex<iProfileListVideos>(`${Tables.ListsVideos} AS LV`)
    .select('V.url_hash AS id', 'V.title', 'V.thumbnail_name AS thumbnail', 'LV.order_id')
    .join(`${Tables.Videos} AS V`, 'LV.video_id', 'V.id')
    .where('LV.list_id', listId)
    .orderBy('LV.order_id')

  videos.forEach((item) => {
    item.thumbnail = createThumbnailUrl(item.thumbnail, ThumbnailSize.Sm)
  })

  httpContext.set('videos', videos)

  next()
}

async function response(req: Request) {
  const list = httpContext.get('list')
  const videos = httpContext.get('videos')
  const authors = httpContext.get('authors')
  const isFavorited: Boolean = httpContext.get('isFavorited')

  return req.Inertia.setViewData({ title: list.title, thumbnail: list.thumbnail }).render({
    component: 'Lists/Details',
    props: {
      id: list.id,
      title: list.title,
      coverId: UrlHash.encode(list.video_cover_id, VIDEO_MODIFIER),
      total_videos: list.total_videos || 0,
      isFavorited,
      user: {
        id: list.user_id,
        name: list.name,
        username: list.username,
        picture: list.picture
      },
      videos,
      authors,
      isMe: req.user ? req.user.id === list.user_id : false,
      modal: false
    }
  })
}

export default asyncRoutes([setListIdAndHashToContext, getIsFavorites, getList, getAuthors, setThumbnails, response])
