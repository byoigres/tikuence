import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import User from './user';

export class UserSocialProvider extends Model<InferAttributes<UserSocialProvider>, InferCreationAttributes<UserSocialProvider>> {
  declare user_id: number;
  declare social_provider_id: number;
  declare profile_id: string;
  declare data: object

  static associate() {
    UserSocialProvider.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'User',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
}

export function initModel(sequelize: Sequelize) {

  UserSocialProvider.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      }
    },
    social_provider_id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'social_provider',
        key: 'id',
      }
    },
    profile_id: {
      type: DataTypes.STRING(256),
      primaryKey: true,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'users_social_providers'
  });

  return UserSocialProvider;
}

export default UserSocialProvider;
