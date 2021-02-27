import { Request } from 'express'
import { checkSchema, validationResult } from 'express-validator'
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
    return req.Inertia.render(invalidResponse)
  }

  const pending = await knex(Tables.PendingUsers)
    .select<{
      email: string
      expiresAt: Date
    }>('email', 'expires_at AS expiresAt')
    .where('token', req.params.token)
    .first()

  if (pending) {
    if (pending.expiresAt > new Date()) {
      return req.Inertia.render({
        component: 'Auth/Register',
        props: {
          email: pending.email,
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

export default [
  ...validations,
  // prepareValidationForErrorMessages('/404'),
  view
]
