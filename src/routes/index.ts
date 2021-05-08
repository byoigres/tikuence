import { Express, Request, Response, NextFunction } from 'express'
// import home from "./home";
// import sessions from "./sessions";
// import events from "./events";
import feed from './feed'
import lists from './lists'
import categories from './categories'
import profile from './profile'
import auth from './auth'
import images from './images'

function bindRoutes(app: Express) {
  app.get('/', feed)
  app.use('/auth', auth)
  app.get('/images/:image', images)
  app.use('/list', lists)
  if (process.env.NODE_ENV !== 'production') {
    app.use('/categories', categories)
  }
  app.use('/users/:username', profile)
  app.use(function (req) {
    req.Inertia.setStatusCode(404).setViewData({ title: 'Page not found' }).render({
      component: 'Errors/404'
    })
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    const { message, stack } = err

    console.log({
      message,
      stack
    })

    return req.Inertia.setStatusCode(500)
      .setViewData({ title: 'Something happened' })
      .render({
        component: 'Errors/500',
        props:
          process.env.NODE_ENV !== 'production'
            ? {
                message,
                stack
              }
            : {}
      })
  })
}

export default bindRoutes
