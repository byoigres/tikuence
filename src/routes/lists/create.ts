import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import { checkSchema } from 'express-validator'
import { prepareValidationForErrorMessages } from '../../middlewares/validations'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex, { Tables } from '../../utils/knex'

interface iPayload {
  title: string
}

const validations = checkSchema({
  title: {
    in: 'body',
    errorMessage: 'You must provide a title for the list',
    isLength: {
      options: {
        min: 1,
        max: 150
      }
    }
  }
})

async function createList(req: Request, res: Response, next: NextFunction) {
  const payload = <iPayload>req.body

  const knex = Knex()

  const listId: Number = await knex(Tables.Lists)
    .insert({
      title: payload.title,
      user_id: req.user ? req.user.id : null
    })
    .returning('id')

  httpContext.set('listId', listId)

  next()
}

function response(req: Request) {
  const listId: Number = httpContext.get('listId')

  req.flash('success', 'List created successfully')

  req.Inertia.redirect(`/list/${listId}/details`)
}

export default [
  isAuthenticated,
  ...validations,
  prepareValidationForErrorMessages('/list/add'),
  createList,
  response
]
