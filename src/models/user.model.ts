import { Table, Column, PrimaryKey, Model, DataType, BelongsToMany } from 'sequelize-typescript'

import SocialProviders from '../models/socialproviders.model'
import UsersSocialProviders from '../models/userssocialproviders.model'

@Table({
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  tableName: 'users',
  schema: 'public'
})
class User extends Model<User> {
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    allowNull: false
  })
  id: number

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
    unique: true
  })
  email: string

  @Column({
    type: DataType.STRING(64),
    allowNull: false
  })
  hash: string

  @BelongsToMany(() => SocialProviders, () => UsersSocialProviders)
  providers: Array<SocialProviders & { relation: UsersSocialProviders }>
}

export default User
