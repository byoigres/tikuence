import express, { Express } from 'express'
import inertia, { populateAuth } from './inertia'
import httpContext from 'express-http-context'
import session from 'express-session'
import flash from 'connect-flash'

import cookies from './cookies'
import returnUrl from './returnUrl'

function middlewares(app: Express) {
  app.use(express.static('public'))
  app.use(express.json())
  app.use(returnUrl)
  app.use(cookies)
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false,
        maxAge: 60000
      }
    })
  )
  app.use(flash())
  app.use(inertia)
  app.use(populateAuth)
  app.use(httpContext.middleware)
}

export default middlewares
