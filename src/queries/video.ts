import Video from '../models/video.model'

export async function queryVideoById(id: number) {
  return Video.findOne({
    where: {
      id
    }
  })
}
