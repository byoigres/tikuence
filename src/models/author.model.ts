import { Table, Column, PrimaryKey, Model, DataType } from 'sequelize-typescript'

@Table({
  timestamps: true,
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
}

export default Author
