import app from './app'
import config from './config'
import db from './models'
import routes from './routes'
import middlewares from './middlewares'

const host = config.get('/app/host')
const port = process.env.PORT || config.get('/app/port') || 3000

async function start() {
  await db({
    url: config.get('/db/url'),
    dialect: config.get('/db/dialect')
  })

  middlewares(app)

  routes(app)

  app.listen(port, host, () => {
    console.log(`Example app listening at http://${host}:${port}`)
  })
}

start()
