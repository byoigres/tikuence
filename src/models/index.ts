import { Dialect } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import Path from 'path'

interface iPluginOptions {
  host: string
  port: number
  database: string
  username: string
  password: string
  dialect: Dialect
}

async function DataBase(options: iPluginOptions) {
  try {
    const sequelize = new Sequelize(options.database, options.username, options.password, {
      host: options.host,
      port: options.port,
      dialect: options.dialect,
      pool: {
        max: 10,
        min: 1,
        idle: 10000
      },
      logging: false, // console.log,
      models: [Path.join(__dirname, '/**/*.model.ts')]
    })

    await sequelize.authenticate()

    // await sequelize.createSchema("schedule", {});
    // await sequelize.createSchema("accounts", {});
    // await sequelize.createSchema("counter", {});

    // sequelize.import(Path.join(__dirname, "./accounts/user.model"));
    // sequelize.import(Path.join(__dirname, "./models/schedule/event"));
    // sequelize.import(Path.join(__dirname, "./models/schedule/pattern"));
    // sequelize.import(Path.join(__dirname, "./models/schedule/category"));
    // sequelize.import(Path.join(__dirname, "./models/schedule/range"));
    // sequelize.import(Path.join(__dirname, "./models/counter/history"));
    // sequelize.import(Path.join(__dirname, "./models/counter/category"));
    // sequelize.import(Path.join(__dirname, "./models/counter/event"));

    console.log('models', Object.keys(sequelize.models))

    await sequelize.sync({ force: false })

    console.log(['plugins/sequelize', 'info'], 'Sequelize models added')
  } catch (err) {
    console.log(['plugins/sequelize', 'error'], err)
  }
}

export default DataBase
