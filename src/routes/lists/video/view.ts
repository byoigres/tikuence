import { Request } from 'express'
import { isAuthenticated } from '../../../middlewares/inertia'
import Knex from '../../../utils/knex'
// import { queryVideoById } from '../../../queries/video'

async function response(req: Request) {
  const { listId, videoId } = req.params

  const knex = Knex()

  const video = await knex('public.videos')
    .select('id', 'title', 'html')
    .where('id', videoId)
    .first()

  if (video) {
    return req.Inertia.setViewData({ title: video.title }).render({
      component: 'Lists/Video',
      props: {
        video
      }
    })
  }

  return req.Inertia.redirect(`/list/${listId}/video/${videoId}`)
}

export default [isAuthenticated, response]
