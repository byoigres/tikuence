import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import List from './list';
import ListVideo from './list_video';

export class Video extends Model<InferAttributes<Video>, InferCreationAttributes<Video>> {
  declare id: CreationOptional<number>;
  declare tiktok_id: string;
  declare title: string;
  declare html: string;
  declare thumbnail_name: CreationOptional<string>;
  declare thumbnail_height: number;
  declare thumbnail_width: number;
  declare url_uid:CreationOptional<string>;
  declare author_id: number;

  static associate() {
    // Video.belongsTo(Author, { foreignKey: 'author_id' });
    // Video.belongsToMany(List, { through: ListVideo });
    Video.hasMany(ListVideo, { foreignKey: 'video_id' });
    Video.belongsToMany(List, {
      through: ListVideo,
      as: "lists"
    });
  }
}

export function initModel(sequelize: Sequelize) {

  Video.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tiktok_id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    thumbnail_name: {
      type: DataTypes.STRING(36),
      allowNull: true,
      defaultValue: null,
    },
    thumbnail_height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    thumbnail_width: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url_uid: {
      type: DataTypes.STRING(16),
      allowNull: true,
      unique: true,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'videos',
  });

  return Video;
}

export default Video;
