import { Request } from 'express'
import User from '../../models/user.model'
import Author from '../../models/author.model'
import Video from '../../models/video.model'
import List from '../../models/list.model'

async function getCounters (req: Request) {
  const payload = req.params

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

  req.Inertia.setViewData({ title: list?.title }).render({
    component: 'Lists/List',
    props: {
      list
    }
  })
}

export default [getCounters]
