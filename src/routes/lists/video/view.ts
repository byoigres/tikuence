import { Request } from 'express'
import { isAuthenticated } from '../../../middlewares/inertia'
import Knex, { Tables } from '../../../utils/knex'

async function response(req: Request) {
  const { listId, videoId } = req.params

  const knex = Knex()

  const video = await knex(Tables.Videos)
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
