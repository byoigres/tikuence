import { Request } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import asyncRoutes from '../../../utils/asyncRoutes'
import Knex, { Tables } from '../../../utils/knex'

const validations = checkSchema({
  token: {
    in: 'params',
    isUUID: {
      errorMessage: 'This page is not valid'
    }
  }
})

async function view(req: Request) {
  const knex = Knex()

  const invalidResponse = {
    component: 'Auth/Register',
    props: {
      isInvalid: true
    }
  }

  const result = validationResult(req)

  // If the token is not an UUID
  if (!result.isEmpty()) {
    if (req.isAuthenticated()) {
      return req.Inertia.redirect('/')
    }
    return req.Inertia.render(invalidResponse)
  }

  const pending = await knex(Tables.PendingUsers)
    .select<{
      email: string
      name: string
      expiresAt: Date
    }>('email', 'name', 'expires_at AS expiresAt')
    .where('token', req.params.token)
    .first()

  if (pending) {
    if (pending.expiresAt > new Date()) {
      return req.Inertia.render({
        component: 'Auth/Register',
        props: {
          email: pending.email,
          name: pending.name,
          token: req.params.token
        }
      })
    } else {
      return req.Inertia.render({
        component: 'Auth/Register',
        props: {
          isExpired: true
        }
      })
    }
  }

  return req.Inertia.render(invalidResponse)
}

export default asyncRoutes([
  ...validations,
  view
])
