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

import Author from './author.model'
import List from './list.model'
import ListsVideos from './listsvideos.model'

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'videos',
  schema: 'public'
})
class Video extends Model<Video> {
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    allowNull: false
  })
  id: number

  @Column({
    type: DataType.STRING(32),
    allowNull: false
  })
  // eslint-disable-next-line camelcase
  tiktok_id: string

  @Column({
    type: DataType.STRING(150),
    allowNull: false
  })
  title: string

  @Column({
    type: DataType.STRING(65536),
    allowNull: false
  })
  html: string

  @Column({
    type: DataType.SMALLINT,
    allowNull: false
  })
  // eslint-disable-next-line camelcase
  thumbnail_width: number

  @Column({
    type: DataType.SMALLINT,
    allowNull: false
  })
  // eslint-disable-next-line camelcase
  thumbnail_height: number

  @Column({
    type: DataType.STRING(2000),
    allowNull: false
  })
  // eslint-disable-next-line camelcase
  thumbnail_name: string

  @BelongsTo(() => Author, {
    as: 'author',
    foreignKey: 'author_id',
    constraints: true
  })
  author: Author

  @BelongsToMany(() => List, () => ListsVideos)
  lists: List[]

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

export default Video
