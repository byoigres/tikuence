import { Dialect } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import Path from 'path'

interface iPluginOptions {
  url: string
  dialect: Dialect
}

async function DataBase(options: iPluginOptions) {
  try {
    console.log(JSON.stringify(options))
    const sequelize = new Sequelize(options.url, {
      pool: {
        max: 10,
        min: 1,
        idle: 10000
      },
      ssl: process.env.NODE_ENV === 'production',
      native: false, // process.env.NODE_ENV === 'production',
      logging: false, // console.log,
      models: [Path.join(__dirname, '/**/*.model.ts'), Path.join(__dirname, '/**/*.model.js')]
    })

    await sequelize.authenticate()

    await sequelize.sync({ force: false })
  } catch (err) {
    console.error(['plugins/sequelize', 'error'], err)
  }
}

export default DataBase
