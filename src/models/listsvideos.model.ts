import { Table, Column, Model, ForeignKey } from 'sequelize-typescript'

import List from './list.model'
import Video from './video.model'

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'lists_videos',
  schema: 'public'
})
class ListsVideos extends Model<ListsVideos> {
  @ForeignKey(() => List)
  @Column
  // eslint-disable-next-line camelcase
  list_id: number

  @ForeignKey(() => Video)
  @Column
  // eslint-disable-next-line camelcase
  video_id: number
}

export default ListsVideos
