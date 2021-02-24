import { Request } from 'express'
import Knex, { Tables, iDetailsItem } from '../../utils/knex'

async function getCounters (req: Request) {
  const payload = req.params

  const knex = Knex()

  const list = await knex<iDetailsItem>(`${Tables} AS L`)
    .select('L.id', 'L.title', 'U.id AS user_id')
    .join(`${Tables} AS U`, 'L.user_id', 'U.id')
    .where('L.id', payload.id)
    .first()

  if (!list) {
    return req.Inertia.setStatusCode(404).setViewData({ title: 'Page not found' }).render({
      component: 'Errors/404'
    })
  }

  const videos = await knex(`${Tables.ListsVideos} AS LV`)
    .select('LV.video_id AS id', 'V.tiktok_id', 'V.title', 'V.html')
    .join(`${Tables.Videos} AS V`, 'LV.video_id', 'V.id')
    .where('LV.list_id', payload.id)
    .orderBy('LV.order_id')

  req.Inertia.setViewData({ title: list.title }).render({
    component: 'Lists/List',
    props: {
      list: {
        ...list,
        videos
      },
      showModal: 'details'
    }
  })
}

export default [getCounters]
