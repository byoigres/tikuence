import express, { Express } from 'express'
import httpContext from 'express-http-context'
import session from 'express-session'
import compression from 'compression'
import flash from 'connect-flash'

import inertia, { populateSharedProps } from './inertia'
import cookies from './cookies'
import passport from './passport'

function middlewares(app: Express) {
  app.use(
    compression({
      level: 9
    })
  )
  app.use(express.static('public'))
  app.use(express.json())
  app.use(cookies)
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 60000 * 60
      }
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())
  app.use(inertia)
  app.use(populateSharedProps)
  app.use(httpContext.middleware)
}

export default middlewares
