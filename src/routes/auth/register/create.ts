import { Request, Response, NextFunction, Express } from 'express'
import { checkSchema } from 'express-validator'
import httpContext from 'express-http-context'
import { prepareValidationForErrorMessages } from '../../../middlewares/validations'
import Knex, { Tables } from '../../../utils/knex'

interface iPayload {
  name: string
  terms: boolean
  token: string
  username: string
  bio?: string,
  tiktokUsername?: string
}

const validations = checkSchema({
  token: {
    in: 'body',
    isUUID: {
      errorMessage: 'The token is not valid'
    }
  },
  name: {
    in: 'body',
    isLength: {
      // errorMessage: 'You must provide a name',
      errorMessage: 'Name must be between 2 and 50 characterers',
      options: {
        min: 2,
        max: 50
      },
      bail: true
    }
  },
  username: {
    in: 'body',
    // TODO: also check for A-Z-a-z0-9\s or valid characteres
    // TODO: validate tiktok username for valid pattern
    isAlphanumeric: {
      errorMessage: 'Username must contains characters from A-Z, 0-1 numbers and underscores.'
    },
    isLength: {
      errorMessage: 'Username must be between 1 and 24 characterers',
      options: {
        min: 1,
        max: 24
      },
      bail: true
    }
  },
  // TODO: validate new fields bio and tiktokUsername
  // TODO: validate tiktok username for valid characters
  terms: {
    in: 'body',
    isBoolean: {
      errorMessage: 'Terms are not provided',
      bail: true
    },
    toBoolean: true,
    custom: {
      options: async (terms) => {
        if (!terms) {
          return Promise.reject(new Error('You MUST accept the terms of service and privacy policy.'))
        }
      }
    }
  }
})

async function verifyTokenExpiration(req: Request, res: Response, next: NextFunction) {
  const knex = Knex()

  const pending = await knex(Tables.PendingUsers)
    .select<{
      email: string
      providerId: string
      identifier: string
      picture: string
      expiresAt: Date
    }>('email', 'provider_id AS providerId', 'identifier', 'profile_picture_url AS picture', 'expires_at AS expiresAt')
    .where('token', req.body.token)
    .first()

  if (pending) {
    if (pending.expiresAt > new Date()) {
      httpContext.set('pending', pending)
      return next()
    } else {
      return req.Inertia.render({
        component: 'Auth/Register',
        props: {
          isExpired: true
        }
      })
    }
  }

  next()
}

async function verifyUsernameAvailability(req: Request, _res: Response, next: NextFunction) {
  const body = <iPayload>req.body
  const knex = Knex()

  const exists = await knex(Tables.Users).select('id', 'username').where('username', body.username).first()

  if (exists) {
    req.flash('errors', JSON.stringify({
      username: 'This username is already taken.'
    }))

    return req.Inertia.redirect(`/auth/register/${req.body.token}`)
  }

  next()
}

async function create(req: Request, _res: Response, next: NextFunction) {
  const body = <iPayload>req.body
  const pending = <
    {
      email: string
      providerId: string
      identifier: string
      picture: string
      expiresAt: Date
    }
  >httpContext.get('pending')
  const knex = Knex()

  const transaction = await knex.transaction()

  try {
    const [userId] = await knex(Tables.Users)
      .transacting(transaction)
      .insert({
        email: pending.email,
        hash: '',
        name: body.name,
        username: body.username,
        biography: body.bio ? body.bio.replace(/\n/g, ' ') : null,
        tiktok_username: body.tiktokUsername,
        profile_picture_url: pending.picture,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('id')

    await knex(`${Tables.UsersSocialProviders} AS USP`).transacting(transaction).insert({
      user_id: userId,
      provider_id: pending.providerId,
      identifier: pending.identifier,
      created_at: new Date(),
      updated_at: new Date()
    })

    await knex(Tables.PendingUsers).transacting(transaction).where('token', req.body.token).del()

    await transaction.commit()

    httpContext.set('user', {
      id: userId,
      email: pending.email,
      username: body.username,
      name: body.name,
      provider: {
        google: pending.providerId
      },
      picture: pending.picture
    })
    return next()
  } catch (err) {
    console.log(err)
    await transaction.rollback()
    req.flash('error', 'Something went wrong... try again')
    return req.Inertia.redirect(`/auth/register/${req.body.token}`)
  }
}

async function response(req: Request, res: Response) {
  const user = <Express.User>httpContext.get('user')

  req.login(user, (err) => {
    if (err) {
      req.flash('error', 'Something went wrong... try again')
      return req.Inertia.redirect(`/auth/register/${req.body.token}`)
    }

    req.flash('success', 'Hey! Welcome to Tikuence 🙂')
    res.redirect('/')
  })
}

export default [
  ...validations,
  prepareValidationForErrorMessages((req: Request) => `/auth/register/${req.body.token}`),
  verifyTokenExpiration,
  verifyUsernameAvailability,
  create,
  response
]
