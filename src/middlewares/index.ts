import express, { Express } from 'express'
import httpContext from 'express-http-context'
import session from 'express-session'
import compression from 'compression'
import flash from 'connect-flash'
import cookieParser from 'cookie-parser'
import csurf from 'csurf'
import inertia, { populateSharedProps } from './inertia'
import passport from './passport'
import Knex from '../utils/knex'
import config from '../config'
import isMobile from './isMobile'
import helmet from './helmet'

const KnexSessionStore = require('connect-session-knex')(session)

// TODO: Move this info to env variables
const store = new KnexSessionStore({
  tablename: 'sessions',
  sidfieldname: 'sid',
  knex: Knex(),
  createtable: false,
  clearInterval: 60000 // Milliseconds
})

function middlewares(app: Express) {
  if (config.get('/session/secure')) {
    // https://stackoverflow.com/a/14465043/1301872
    app.enable('trust proxy')
    console.log('trust proxy is set')
  }

  app.use(
    compression({
      level: 9
    })
  )
  app.use(express.static('public'))
  app.use(express.json())
  app.use(
    session({
      name: config.get('/session/name'),
      secret: config.get('/session/secret').toString().split(','),
      resave: !!config.get('/session/resave'),
      saveUninitialized: !!config.get('/session/saveUninitialized'),
      // https://stackoverflow.com/a/44435742/1301872
      proxy: !!config.get('/session/secure'),
      cookie: {
        domain: process.env.NODE_ENV === 'production' ? config.get('/session/domain') : undefined,
        httpOnly: true,
        sameSite: false,
        secure: !!config.get('/session/secure'),
        maxAge: config.get('/session/maxAge')
      },
      store
    })
  )
  app.use(cookieParser())
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())
  app.use(inertia)
  app.use(
    csurf({
      // TODO: Investigate how to use this
      ignoreMethods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      cookie: {
        key: 'XSRF-TOKEN'
        // domain: process.env.NODE_ENV === 'production' ? config.get('/session/domain') : undefined,
        // httpOnly: true,
        // sameSite: false,
        // secure: !!config.get('/session/secure'),
        // maxAge: config.get('/session/maxAge')
      }
    })
  )
  app.use(populateSharedProps)
  app.use(isMobile)
  app.use(httpContext.middleware)
  app.use(helmet)
}

export default middlewares
