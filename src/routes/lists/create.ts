import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import { checkSchema } from 'express-validator'
import { prepareValidationForErrorMessages } from '../../middlewares/validations'
import { isAuthenticated } from '../../middlewares/inertia'
import { getAllListsWithVideos } from './list'
import List from '../../models/list.model'

interface iPayload {
  title: string
}

const validations = checkSchema({
  title: {
    in: 'body',
    errorMessage: 'You must provide a title for the list',
    isAlphanumeric: true,
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

  const list = await List.create({
    title: payload.title,
    user_id: 1
  })

  httpContext.set('listId', list.id)

  next()
}

function response(req: Request, res: Response) {
  const listId: List = httpContext.get('listId')

  req.flash('success', 'List created successfully')

  req.Inertia.redirect(`/list/${listId}/edit`)
}

export default [
  isAuthenticated,
  ...validations,
  prepareValidationForErrorMessages('/list/add'),
  createList,
  getAllListsWithVideos,
  response
]
