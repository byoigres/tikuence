import {
  Sequelize,
  Table,
  Column,
  PrimaryKey,
  Model,
  DataType,
  Default,
  BelongsTo,
  BelongsToMany
} from 'sequelize-typescript'

import User from './user.model'
import Video from './video.model'
import ListsVideos from './listsvideos.model'

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'lists',
  schema: 'public'
})
class List extends Model<List> {
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    allowNull: false
  })
  id: number

  @Column({
    type: DataType.STRING(150),
    allowNull: false
  })
  title: string

  @BelongsTo(() => User, {
    as: 'user',
    foreignKey: 'user_id',
    constraints: true
  })
  author: User

  @BelongsToMany(() => Video, () => ListsVideos)
  videos: Array<Video & { relation: ListsVideos }>

  @Default(Sequelize.literal('NOW()'))
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  // eslint-disable-next-line camelcase
  created_at: Date

  @Default(Sequelize.literal('NOW()'))
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  // eslint-disable-next-line camelcase
  updated_at: Date
}

export default List
