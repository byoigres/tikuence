import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class Language extends Model<InferAttributes<Language>, InferCreationAttributes<Language>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare code: string;
}

export function initModel(sequelize: Sequelize) {

  Language.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
  }, {
    sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'languages',
  });

  return Language;
}

export default Language;
