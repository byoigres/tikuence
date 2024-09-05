import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import Lists from './lists';

export class ListsLanguages extends Model<InferAttributes<ListsLanguages>, InferCreationAttributes<ListsLanguages>> {
  declare list_id: number;
  declare language_id: number;

  static associate() {
    ListsLanguages.belongsTo(Lists, {
      foreignKey: 'list_id',
      targetKey: 'id',
    });
  }
}

export function initModel(sequelize: Sequelize) {

  ListsLanguages.init({
    list_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    language_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    tableName: 'lists_languages',
  });

  return ListsLanguages;
}
