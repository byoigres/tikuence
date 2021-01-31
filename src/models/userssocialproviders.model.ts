import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript'

import User from './user.model'
import SocialProviders from './socialproviders.model'

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'users_social_providers',
  schema: 'public'
})
class UsersSocialProviders extends Model<UsersSocialProviders> {
  @ForeignKey(() => User)
  @Column
  // eslint-disable-next-line camelcase
  user_id: number

  @ForeignKey(() => SocialProviders)
  @Column
  // eslint-disable-next-line camelcase
  provider_id: number

  @Column({
    type: DataType.STRING(256),
    allowNull: false
  })
  // eslint-disable-next-line camelcase
  identifier: string
}

export default UsersSocialProviders
