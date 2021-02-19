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
  app.use(function (req, res, next) {
    req.Inertia.setStatusCode(404).setViewData({ title: 'Page not found' }).render({
      component: 'Errors/404'
    })
  })
}

export default bindRoutes
