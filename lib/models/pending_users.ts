import { Sequelize, Model, DataTypes, Optional, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import SocialProviders from './social_providers';

export class PendingUser extends Model<InferAttributes<PendingUser>, InferCreationAttributes<PendingUser>> {
  declare email: string;
  declare name: string;
  declare provider_id: number;
  declare profile_id: string;
  declare expires_at: Date;
  declare token: string;
  declare profile_picture_url: string;
}

export function initModel(sequelize: Sequelize) {

  PendingUser.init({
    email: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    provider_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: SocialProviders,
        key: 'id',
      }
    },
    profile_id: {
      type: DataTypes.STRING(256),
      primaryKey: true,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    profile_picture_url: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'pending_users'
  });

  PendingUser.belongsTo(SocialProviders, {
    foreignKey: 'provider_id',
    targetKey: 'id',
  });

  return PendingUser;
};

export default PendingUser;

