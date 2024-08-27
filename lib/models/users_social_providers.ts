import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import Users from './users';
import SocialProviders from './social_providers';

export class UsersSocialProviders extends Model<InferAttributes<UsersSocialProviders>, InferCreationAttributes<UsersSocialProviders>> {
  declare user_id: number;
  declare provider_id: number;
  declare profile_id: string;
  declare data: Object

  static associate() {
    UsersSocialProviders.belongsTo(Users, {
      foreignKey: 'user_id',
      as: 'User',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
}

export function initModel(sequelize: Sequelize) {

  UsersSocialProviders.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      }
    },
    provider_id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'social_providers',
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

  return UsersSocialProviders;
}

export default UsersSocialProviders;
