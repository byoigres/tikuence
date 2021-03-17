import { Request } from 'express'
import Knex, { Tables, iProfileListVideos } from '../../utils/knex'

async function view(req: Request) {
  const params = req.params

  const knex = Knex()

  const list = await knex(`${Tables.Lists} AS L`)
    .select('L.id', 'L.title', 'L.user_id', 'U.username')
    .join(`${Tables.Users} AS U`, 'L.user_id', 'U.id')
    .where({ 'L.id': params.listId })
    .first()

  if (list) {
    const videos = await knex<iProfileListVideos>(`${Tables.ListsVideos} AS LV`)
      .select('V.id', 'V.title', 'V.thumbnail_name', 'LV.order_id')
      .join(`${Tables.Videos} AS V`, 'LV.video_id', 'V.id')
      .where('LV.list_id', params.listId)
      .orderBy('LV.order_id')

    return req.Inertia.setViewData({ title: 'Edit list' }).render({
      component: 'Lists/Details',
      props: {
        details: {
          id: list.id,
          title: list.title,
          user: {
            id: list.user_id,
            username: list.username
          },
          videos: videos
        },
        isMe: req.user ? req.user.id === list.user_id : false,
        showModal: ''
      }
    })
  }

  req.Inertia.setStatusCode(404).setViewData({ title: 'Page not found' }).render({
    component: 'Errors/404'
  })
}

export default [view]
