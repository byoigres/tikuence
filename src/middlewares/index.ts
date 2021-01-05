import express, { Express } from 'express'
import inertia, { populateAuth } from './inertia'
import httpContext from 'express-http-context'

import cookies from './cookies'

function middlewares(app: Express) {
  app.use(express.static('public'))
  app.use(express.json())
  app.use(cookies)
  app.use(inertia)
  app.use(populateAuth)
  //   app.use(context);
  app.use(httpContext.middleware)
}

export default middlewares
