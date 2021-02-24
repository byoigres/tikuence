import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import { checkSchema } from 'express-validator'
import { prepareValidationForErrorMessages } from '../../middlewares/validations'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex from '../../utils/knex'

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

  const listId: Number = await knex('public.lists')
    .insert({
      title: payload.title,
      user_id: req.user ? req.user.id : null
    })
    .returning('id')

  httpContext.set('listId', listId)

  next()
}

function response(req: Request, res: Response) {
  const listId: Number = httpContext.get('listId')

  req.flash('success', 'List created successfully')

  req.Inertia.redirect(`/list/${listId}/edit`)
}

export default [
  isAuthenticated,
  ...validations,
  prepareValidationForErrorMessages('/list/add'),
  createList,
  response
]
