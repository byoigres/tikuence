import express, { Express } from 'express'
import httpContext from 'express-http-context'
import session from 'express-session'
import compression from 'compression'
import flash from 'connect-flash'

import inertia, { populateSharedProps } from './inertia'
// import cookies from './cookies'
import passport from './passport'
import Knex from '../utils/knex'
import config from '../config'

const KnexSessionStore = require('connect-session-knex')(session)

const store = new KnexSessionStore({
  tablename: 'sessions',
  sidfieldname: 'sid',
  knex: Knex(),
  createtable: false,
  clearInterval: 60000 // Milliseconds
})

function middlewares(app: Express) {
  app.use(
    compression({
      level: 9
    })
  )
  app.use(express.static('public'))
  app.use(express.json())
  // app.use(cookies)
  app.use(
    session({
      name: config.get('/session/name'),
      secret: config.get('/session/secret').toString().split(','),
      resave: !!config.get('/session/resave'),
      saveUninitialized: !!config.get('/session/saveUninitialized'),
      cookie: {
        domain: config.get('/session/domain'),
        httpOnly: true,
        sameSite: true,
        secure: !!config.get('/session/secure'),
        maxAge: config.get('/session/maxAge')
      },
      store
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
