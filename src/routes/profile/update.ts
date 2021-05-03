import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { prepareValidationForErrorMessages } from '../../middlewares/validations'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex, { Tables } from '../../utils/knex'
import asyncRoutes from '../../utils/asyncRoutes'

const validations = checkSchema({
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
  }
})

async function verifyParams(req: Request, res: Response, next: NextFunction) {
  const isMe = req.isAuthenticated() && req.params.username === req.user.username

  if (!isMe) {
    req.flash('error', 'You are not allowed to do this action')
    return req.Inertia.redirect(`/users/${req.params.username}`)
  }

  next()
}

async function updateFields(req: Request, res: Response, next: NextFunction) {
  const knex = Knex()

  const transaction = await knex.transaction()

  try {
    await knex(Tables.Users)
      .transacting(transaction)
      .update({
        name: req.body.name,
        biography: req.body.bio || null,
        tiktok_username: req.body.tiktokUsername || null
      })
      .where({
        id: req.user?.id || 0
      })
    await transaction.commit()
  } catch (err) {
    console.log(err)
    await transaction.rollback()
    throw err
  }

  next()
}

async function response(req: Request) {
  // const user = httpContext.get('user')
  // const isMe = httpContext.get('isMe')

  req.flash('success', 'Profile updated')

  return req.Inertia.redirect(`/users/${req.params.username}`)

  // req.Inertia.setViewData({ title: 'Edit my Profile' }).render({
  //   component: 'Profile/Profile',
  //   props: {
  //     user,
  //     isMe,
  //     modal: false
  //   }
  // })
}

export default asyncRoutes([
  isAuthenticated,
  ...validations,
  prepareValidationForErrorMessages((req: Request) => `/users/${req.params.username}/edit`),
  verifyParams,
  updateFields,
  response
])
