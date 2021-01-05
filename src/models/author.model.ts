import { Sequelize, Table, Column, PrimaryKey, Model, DataType, Default } from 'sequelize-typescript'

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'authors',
  schema: 'public'
})
class Author extends Model<Author> {
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    allowNull: false
  })
  id: number

  @Column({
    type: DataType.STRING(24),
    allowNull: false
  })
  username: string

  @Column({
    type: DataType.STRING(30),
    allowNull: false
  })
  name: string

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

export default Author
