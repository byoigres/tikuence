import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class Languages extends Model<InferAttributes<Languages>, InferCreationAttributes<Languages>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare code: string;
}

export function initModel(sequelize: Sequelize) {

  Languages.init({
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

  return Languages;
}

export default Languages;
