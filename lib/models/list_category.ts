import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import List from './list';

export class ListCategory extends Model<InferAttributes<ListCategory>, InferCreationAttributes<ListCategory>> {
  declare list_id: number;
  declare category_id: number;

  static associate() {
    ListCategory.belongsTo(List, {
      foreignKey: 'list_id',
      targetKey: 'id',
    });
  }
}

export function initModel(sequelize: Sequelize) {

  ListCategory.init({
    list_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    tableName: 'lists_categories',
  });

  return ListCategory;
}
