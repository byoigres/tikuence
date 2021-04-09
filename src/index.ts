import app from './app'
import config from './config'
import './utils/knex'
import middlewares from './middlewares'
import routes from './routes'

const host = config.get('/app/host')
const port = process.env.PORT || config.get('/app/port') || 3000

async function start() {
  middlewares(app)

  routes(app)

  app.listen(port, host, () => {
    console.log(`Example app listening at http://${host}:${port}`)
  })
}

start()
