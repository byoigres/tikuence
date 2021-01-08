
import User from '../models/user.model'
import Author from '../models/author.model'
import Video from '../models/video.model'
import List from '../models/list.model'

export async function queryAllLists(withVideos = false) {
  return await List.findAll({
    attributes: ['id', 'title'],
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
        required: withVideos,
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
}

export async function queryListById(id: number) {
  const list = await List.findByPk(id)

  if (list) {
    return true
  } else {
    return false
  }
}

export async function queryDeleteListById(id: number) {
  return await List.destroy({
    where: {
      id
    }
  })
}
