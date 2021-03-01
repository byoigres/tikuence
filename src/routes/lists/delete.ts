import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { prepareValidationForFlashMessage } from '../../middlewares/validations'
import asyncRoutes from '../../utils/asyncRoutes'
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

async function verifyIfListBelongsToCurrentUser(req: Request, _res: Response, next: NextFunction) {
  const { listId } = req.params

  const knex = Knex()

  const list = await knex(Tables.Lists)
    .where({
      id: listId,
      user_id: req.user?.id ?? 0
    })
    .first()

  if (!list) {
    req.flash('warning', 'The list does not belong to the current user')

    return req.Inertia.redirect(`/list/${listId}/video/add`)
  }

  next()
}

async function deleteList(req: Request, res: Response, next: NextFunction) {
  const params = req.params

  const knex = Knex()

  await knex(Tables.Lists).where('id2', params.listId).delete()

  next()
}

async function response(req: Request) {
  req.flash('success', 'List had been removed')

  req.Inertia.redirect(`/users/${req.user?.username}`)
}

export default asyncRoutes([
  isAuthenticated,
  ...validations,
  verifyIfListBelongsToCurrentUser,
  prepareValidationForFlashMessage('/profile/lists'),
  deleteList,
  response
])
