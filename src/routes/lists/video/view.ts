import { Request } from 'express'
import { isAuthenticated } from '../../../middlewares/inertia'
import { queryVideoById } from '../../../queries/video'

async function response(req: Request) {
  const { listId, videoId } = req.params

  const video = await queryVideoById(parseInt(videoId, 10))

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
