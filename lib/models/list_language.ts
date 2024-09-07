import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
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

  return ListLanguage;
}
