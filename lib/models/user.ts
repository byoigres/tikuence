import { Sequelize, Model, DataTypes, Optional, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare hash: string;
  declare name: string;
  declare username: string;
  declare biography: string;
  declare tiktok_username: string;
  declare profile_picture_url: string;
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
    sequelize
  });
};

export default User;

