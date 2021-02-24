import { Request } from 'express'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex, { iProfileListVideos } from '../../utils/knex'

async function view(req: Request) {
  const userId = req.user ? req.user.id : null
  const params = req.params

  const knex = Knex()

  const list = await knex('public.lists')
    .select('id', 'title')
    .where({ id: params.listId, user_id: userId ? userId.toString() : '0' })
    .first()

  if (list) {
    const videos = await knex<iProfileListVideos>('public.lists_videos AS LV')
      .select('V.id', 'V.title', 'V.thumbnail_name', 'LV.order_id')
      .join('public.videos AS V', 'LV.video_id', 'V.id')
      .where('LV.list_id', params.listId)
      .orderBy('LV.order_id')

    return req.Inertia.setViewData({ title: 'Edit list' }).render({
      component: 'Lists/Edit',
      props: {
        list: {
          id: list.id,
          title: list.title,
          videos: videos
        }
      }
    })
  }

  req.Inertia.setStatusCode(404).setViewData({ title: 'Page not found' }).render({
    component: 'Errors/404'
  })
}

export default [isAuthenticated, view]
