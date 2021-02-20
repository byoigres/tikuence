import {
  Table,
  Column,
  PrimaryKey,
  Model,
  DataType,
  BelongsToMany
} from 'sequelize-typescript'

import User from './user.model'
import UsersSocialProviders from './userssocialproviders.model'

@Table({
  timestamps: true,
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
  users: User[]
}

export default SocialProvider
