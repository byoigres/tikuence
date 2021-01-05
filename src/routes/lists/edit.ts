import { Request } from 'express'
import User from '../../models/user.model'
import Author from '../../models/author.model'
import Video from '../../models/video.model'
import List from '../../models/list.model'

// interface iPayload {
//     id: number;
// }

async function getCounters (req: Request) {
  const params = req.params
  console.log(req.params)

  const list = await List.findOne({
    attributes: ['id', 'title'],
    where: {
      id: params.listId
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
        attributes: ['id', 'title', 'thumbnail_width', 'thumbnail_height', 'thumbnail_name'],
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

  req.Inertia.setViewData({ title: 'Counter events' }).render({
    component: 'Lists/Edit',
    props: {
      list
    }
  })
}

export default [getCounters]
