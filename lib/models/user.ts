import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import UserSocialProvider from './user_social_provider';
import SocialProvider from './social_provider';
import List from './list';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare hash: string;
  declare name: string;
  declare username: string;
  declare biography: string;
  declare tiktok_username: string;
  declare profile_picture_url: string;

  static associate() {
    User.hasMany(List, { foreignKey: 'user_id' });
    User.hasMany(UserSocialProvider, { foreignKey: 'user_id' });
    User.belongsToMany(SocialProvider, { through: UserSocialProvider });
  }
}

export function initModel(sequelize: Sequelize) {

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true
    },
    hash: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    biography: {
      type: DataTypes.STRING(160),
      allowNull: false
    },
    tiktok_username: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    profile_picture_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  }, {
    sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'users'
  });

  return User;
};

export default User;

