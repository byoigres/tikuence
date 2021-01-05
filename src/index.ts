import app from './app'
import db from './models'
import routes from './routes'
import middlewares from './middlewares'
const port = 3000

async function start() {
  await db({
    host: 'localhost',
    port: 6250,
    database: 'tikuence',
    username: 'tikuence',
    password: 'tikuence',
    dialect: 'postgres'
  })

  middlewares(app)

  routes(app)

  app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening at http://0.0.0.0:${port}`)
  })
}

start()
