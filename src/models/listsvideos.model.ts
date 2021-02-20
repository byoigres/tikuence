import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript'

import List from './list.model'
import Video from './video.model'

@Table({
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  tableName: 'lists_videos',
  modelName: 'order',
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

  @Column({
    type: DataType.SMALLINT,
    allowNull: false
  })
  // eslint-disable-next-line camelcase
  order_id: number
}

export default ListsVideos
