import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class Hashtag extends Model<InferAttributes<Hashtag>, InferCreationAttributes<Hashtag>> {
  declare id: CreationOptional<number>;
  declare hashtag: string;
}

export function initModel(sequelize: Sequelize) {

  Hashtag.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hashtag: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    tableName: 'hashtags',
  });

  return Hashtag;
}

export default Hashtag;
