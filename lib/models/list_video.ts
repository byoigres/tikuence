import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import List from './list';
import Video from './video';

export class ListVideo extends Model<InferAttributes<ListVideo>, InferCreationAttributes<ListVideo>> {
  declare list_id: number;
  declare video_id: number;
  declare order_id: CreationOptional<number>;

  static associate() {
    ListVideo.belongsTo(List, { foreignKey: 'list_id' });
    ListVideo.belongsTo(Video, { foreignKey: 'video_id' });
  }
}

export function initModel(sequelize: Sequelize) {

  ListVideo.init({
    list_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'List',
        key: 'id',
      },
    },
    video_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Video',
        key: 'id',
      },
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    tableName: 'lists_videos',
  });

  return ListVideo;
}


export default ListVideo;
