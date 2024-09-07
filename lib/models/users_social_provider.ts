import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import Users from './users';

export class UsersSocialProvider extends Model<InferAttributes<UsersSocialProvider>, InferCreationAttributes<UsersSocialProvider>> {
  declare user_id: number;
  declare provider_id: number;
  declare profile_id: string;
  declare data: Object

  static associate() {
    UsersSocialProvider.belongsTo(Users, {
      foreignKey: 'user_id',
      as: 'User',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
}

export function initModel(sequelize: Sequelize) {

  UsersSocialProvider.init({
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

  return UsersSocialProvider;
}

export default UsersSocialProvider;
