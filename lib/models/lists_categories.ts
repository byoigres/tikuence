import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import Lists from './lists';

export class ListsCategories extends Model<InferAttributes<ListsCategories>, InferCreationAttributes<ListsCategories>> {
  declare list_id: number;
  declare category_id: number;

  static associate() {
    ListsCategories.belongsTo(Lists, {
      foreignKey: 'list_id',
      targetKey: 'id',
    });
  }
}

export function initModel(sequelize: Sequelize) {

  ListsCategories.init({
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

  return ListsCategories;
}
