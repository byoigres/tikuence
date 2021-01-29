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
// import List from './list.model'
import UsersSocialProviders from './userssocialproviders.model'

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'social_providers',
  schema: 'public'
})
class SocialProvider extends Model<SocialProvider> {
  @PrimaryKey
  @Column({
    type: DataType.SMALLINT,
    autoIncrement: true,
    allowNull: false
  })
  id: number

  @Column({
    type: DataType.STRING(32),
    allowNull: false
  })
  name: string

  @BelongsToMany(() => User, () => UsersSocialProviders)
  lists: User[]

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

export default SocialProvider
