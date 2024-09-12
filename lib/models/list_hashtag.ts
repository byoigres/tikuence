import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class ListHashtag extends Model<InferAttributes<ListHashtag>, InferCreationAttributes<ListHashtag>> {
  declare list_id: number;
  declare hashtag_id: number;
}

export function initModel(sequelize: Sequelize) {

  ListHashtag.init({
    list_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'List',
        key: 'id',
      },
    },
    hashtag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
        references: {
          model: 'Hashtag',
          key: 'id',
        },
    },
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    tableName: 'lists_hashtags',
  });

  return ListHashtag;
}

export default ListHashtag;
