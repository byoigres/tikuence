import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class Author extends Model<InferAttributes<Author>, InferCreationAttributes<Author>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare name: string;
}

export function initModel(sequelize: Sequelize) {

  Author.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(24),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
  }, {
    sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'authors',
  });

  return Author;
};

export default Author;
