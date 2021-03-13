import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { prepareValidationForErrorMessages } from '../../middlewares/validations'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex, { Tables } from '../../utils/knex'

const validations = checkSchema({
  listId: {
    in: 'params',
    isNumeric: {
      errorMessage: 'The provided id of the list is not valid',
      bail: true
    },
    toInt: true,
    custom: {
      errorMessage: 'The id does not exists 1',
      options: async (value) => {
        const knex = Knex()
        try {
          const list = await knex(Tables.Lists).where('id', value).first()
          if (!list) {
            /* eslint prefer-promise-reject-errors: 0 */
            return Promise.reject('The list does not exists 2')
          }
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
  },
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

/**
 * TODO: check if list belongs to the current user
 */

async function updateList(req: Request, _res: Response, next: NextFunction) {
  const { listId } = req.params
  const { title } = req.body

  const knex = Knex()

  await knex(Tables.Lists).update('title', title).where('id', listId)

  next()
}

async function response(req: Request) {
  const { listId } = req.params

  req.flash('success', 'Title updated successfully')
  req.Inertia.redirect(`/list/${listId}/details`)
}

export default [
  isAuthenticated,
  ...validations,
  prepareValidationForErrorMessages((req: Request) => `/list/${req.params.listId}/details`),
  updateList,
  response
]
