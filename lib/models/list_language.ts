import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import List from './list';

export class ListLanguage extends Model<InferAttributes<ListLanguage>, InferCreationAttributes<ListLanguage>> {
  declare list_id: number;
  declare language_id: number;

  static associate() {
    ListLanguage.belongsTo(List, {
      foreignKey: 'list_id',
      targetKey: 'id',
    });
  }
}

export function initModel(sequelize: Sequelize) {

  ListLanguage.init({
    list_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'List',
        key: 'id',
      },
    },
    language_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Language',
        key: 'id',
      },
    },
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    tableName: 'lists_languages',
  });

  return ListLanguage;
}
