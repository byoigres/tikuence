import { Dialect } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import Path from 'path'

interface iPluginOptions {
  url: string
  dialect: Dialect
}

async function DataBase(options: iPluginOptions) {
  try {
    const sequelizeOptions = {
      pool: {
        max: 10,
        min: 1,
        idle: 10000
      },
      dialectOptions: {},
      ssl: process.env.NODE_ENV === 'production',
      native: false,
      logging: false, // console.log,
      models: [Path.join(__dirname, '/**/*.model.ts'), Path.join(__dirname, '/**/*.model.js')]
    }

    if (process.env.NODE_ENV === 'production') {
      sequelizeOptions.dialectOptions = {
        ssl: {
          require: true,
          rejectUnauthorized: false // <<<<<<< YOU NEED THIS
        }
      }
    }

    const sequelize = new Sequelize(options.url, sequelizeOptions)

    await sequelize.authenticate()

    await sequelize.sync({ force: false })
  } catch (err) {
    console.error(['plugins/sequelize', 'error'], err)
  }
}

export default DataBase
