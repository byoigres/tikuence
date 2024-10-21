import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import Video from './video';
import ListVideo from './list_video';
import User from './user';

export class List extends Model<InferAttributes<List>, InferCreationAttributes<List>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare video_cover_id: CreationOptional<number>;
  declare url_uid: string;
  declare user_id: number;

  static associate() {
    List.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    // List.belongsToMany(Category, { through: ListCategory });
    // List.belongsToMany(Hashtag, { through: ListHashtag });
    // List.belongsToMany(Language, { through: ListLanguage });
    // List.belongsToMany(Video, { through: ListVideo });
    // List.hasMany(ListCategory, { foreignKey: 'list_id' });
    // List.hasMany(ListHashtag, { foreignKey: 'list_id' });
    // List.hasMany(ListLanguage, { foreignKey: 'list_id' });
    List.hasMany(ListVideo, { foreignKey: 'list_id' });
    List.belongsToMany(Video, {
      through: ListVideo,
      as: "videos"
    });

    // List.belongsTo(User, {
    //   // foreignKey: 'user_id',
    //   as: 'user',
    //   // onDelete: 'CASCADE',
    //   // onUpdate: 'CASCADE'
    // });
  }
}

export function initModel(sequelize: Sequelize) {

  List.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    video_cover_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    url_uid: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'lists',
  });

  return List;
}

export default List;
