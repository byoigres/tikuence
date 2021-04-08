import { Request } from 'express'
import httpContext from 'express-http-context'
import Knex, { Tables, iProfileListVideos } from '../../utils/knex'
import { setListIdAndHashToContext } from '../../middlewares/utils'
import { getIsFavorites } from '../lists/list'

async function view(req: Request) {
  const listId = httpContext.get('listId')
  const isFavorited: Boolean = httpContext.get('isFavorited')

  const knex = Knex()

  const list = await knex(`${Tables.Lists} AS L`)
    .select('L.url_hash AS id', 'L.title', 'L.user_id', 'U.username', 'U.profile_picture_url AS picture')
    .join(`${Tables.Users} AS U`, 'L.user_id', 'U.id')
    .where({ 'L.id': listId })
    .first()

  if (list) {
    const videos = await knex<iProfileListVideos>(`${Tables.ListsVideos} AS LV`)
      .select('V.url_hash AS id', 'V.title', 'V.thumbnail_name', 'LV.order_id')
      .join(`${Tables.Videos} AS V`, 'LV.video_id', 'V.id')
      .where('LV.list_id', listId)
      .orderBy('LV.order_id')

    return req.Inertia.setViewData({ title: 'Edit list' }).render({
      component: 'Lists/Details',
      props: {
        id: list.id,
        title: list.title,
        isFavorited,
        user: {
          id: list.user_id,
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

export default [setListIdAndHashToContext, getIsFavorites, view]
