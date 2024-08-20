import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export enum SocialProvidersEnum {
  GOOGLE = "google",
}

export class SocialProviders extends Model<InferAttributes<SocialProviders>, InferCreationAttributes<SocialProviders>> {
  declare id: CreationOptional<number>;
  declare name: SocialProvidersEnum;
}

export function initModel(sequelize: Sequelize) {

  SocialProviders.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.ENUM(...Object.values(SocialProvidersEnum)),
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'social_providers'
  });
};

export default SocialProviders;

