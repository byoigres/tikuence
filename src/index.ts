import app from './app'
import config from './config'
import db from './models'
import routes from './routes'
import middlewares from './middlewares'

const host = config.get('/app/host')
const port = config.get('/app/port')

async function start() {
  await db({
    host: config.get('/db/host'),
    port: config.get('/db/port'),
    database: config.get('/db/database'),
    username: config.get('/db/username'),
    password: config.get('/db/password'),
    dialect: config.get('/db/dialect')
  })

  middlewares(app)

  routes(app)

  app.listen(port, host, () => {
    console.log(`Example app listening at http://${host}:${port}`)
  })
}

start()
