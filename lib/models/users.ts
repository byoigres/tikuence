import { Sequelize, Model, DataTypes, Optional, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import UsersSocialProviders from './users_social_providers';

export class Users extends Model<InferAttributes<Users>, InferCreationAttributes<Users>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare hash: string;
  declare name: string;
  declare username: string;
  declare biography: string;
  declare tiktok_username: string;
  declare profile_picture_url: string;

  static associate() {
    Users.hasMany(UsersSocialProviders, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
}

export function initModel(sequelize: Sequelize) {

  Users.init({
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

  return Users;
};

export default Users;
