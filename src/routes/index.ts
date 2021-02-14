import { Express } from 'express'
// import home from "./home";
// import sessions from "./sessions";
// import events from "./events";
import home from './lists/list'
import lists from './lists'
import profile from './profile'
import auth from './auth'
import images from './images'

function bindRoutes(app: Express) {
  app.get('/', home)
  app.use('/', auth)
  app.get('/images/:image', images)
  app.use('/list', lists)
  app.use('/profile', profile)
}

export default bindRoutes
