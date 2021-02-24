import { Request } from 'express'
import Knex, { iDetailsItem } from '../../utils/knex'

async function getCounters (req: Request) {
  const payload = req.params

  const knex = Knex()

  const list = await knex<iDetailsItem>('public.lists AS L')
    .select('L.id', 'L.title', 'U.id AS user_id')
    .join('public.users AS U', 'L.user_id', 'U.id')
    .where('L.id', payload.id)
    .first()

  if (!list) {
    return req.Inertia.setStatusCode(404).setViewData({ title: 'Page not found' }).render({
      component: 'Errors/404'
    })
  }

  const videos = await knex('lists_videos AS LV')
    .select('LV.video_id AS id', 'V.tiktok_id', 'V.title', 'V.html')
    .join('videos AS V', 'LV.video_id', 'V.id')
    .where('LV.list_id', payload.id)
    .orderBy('LV.order_id')
  /*
  const list = await List.findOne({
    attributes: ['id', 'title'],
    where: {
      id: payload.id
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email']
      },
      {
        model: Video,
        as: 'videos',
        attributes: ['id', 'tiktok_id', 'title', 'html', 'thumbnail_width', 'thumbnail_height', 'thumbnail_name'],
        // The list must have videos
        required: true,
        include: [
          {
            model: Author,
            as: 'author',
            attributes: ['id', 'username']
          }
        ]
      }
    ]
  })
  */

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
