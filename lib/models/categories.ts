import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class Categories extends Model<InferAttributes<Categories>, InferCreationAttributes<Categories>> {
  declare id: CreationOptional<number>;
  declare description: string;
  declare url_identifier: string;
}

export function initModel(sequelize: Sequelize) {

  Categories.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    url_identifier: {
      type: DataTypes.STRING(32),
      unique: true,
      allowNull: false
    },
  }, {
    sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'categories',
  });

  return Categories;
}

export default Categories;
