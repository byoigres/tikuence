import { Sequelize, Table, Column, PrimaryKey, Model, DataType, Default } from 'sequelize-typescript'

@Table({
  timestamps: false,
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

export default User
