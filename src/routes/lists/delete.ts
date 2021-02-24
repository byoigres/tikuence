import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { prepareValidationForFlashMessage } from '../../middlewares/validations'
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
      options: async value => {
        const knex = Knex()
        try {
          const list = await knex(Tables.Lists).where('id', value).first()
          if (!list) {
            /* eslint prefer-promise-reject-errors: 0 */
            return Promise.reject('The list does not exists 1')
          }
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
  }
})

/**
 * TODO: check if list belongs to the current user
 */

async function deleteList(req: Request, res: Response, next: NextFunction) {
  const params = req.params

  const knex = Knex()

  await knex(Tables.Lists).where('id', params.listId).delete()

  next()
}

async function response(req: Request) {
  req.flash('success', 'List had been removed')
  req.Inertia.redirect('/profile/lists')
}

export default [
  isAuthenticated,
  ...validations,
  prepareValidationForFlashMessage('/profile/lists'),
  deleteList,
  response
]
