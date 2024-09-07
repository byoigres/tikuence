import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export enum SocialProvidersEnum {
  GOOGLE = "google",
}

export class SocialProvider extends Model<InferAttributes<SocialProvider>, InferCreationAttributes<SocialProvider>> {
  declare id: CreationOptional<number>;
  declare name: SocialProvidersEnum;
}

export function initModel(sequelize: Sequelize) {

  SocialProvider.init({
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

  return SocialProvider
};

export default SocialProvider;

