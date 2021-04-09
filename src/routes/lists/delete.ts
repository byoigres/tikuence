import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import httpContext from 'express-http-context'
import { prepareValidationForFlashMessage } from '../../middlewares/validations'
import asyncRoutes from '../../utils/asyncRoutes'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex, { Tables } from '../../utils/knex'
import { setListIdAndHashToContext, getListIdFromHash } from '../../middlewares/utils'

const validations = checkSchema({
  hash: {
    in: 'params',
    matches: {
      errorMessage: 'The provided hash of the list is not valid',
      options: /[A-Za-z0-9_]{8,15}/
    },
    custom: {
      errorMessage: 'The id does not exists 1',
      options: async (value) => {
        const knex = Knex()
        try {
          const listId = getListIdFromHash(value)
          const list = await knex(Tables.Lists).where('id', listId).first()
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
  const listId = httpContext.get('listId')
  const hash = httpContext.get('hash')

  const knex = Knex()

  const list = await knex(Tables.Lists)
    .where({
      id: listId,
      user_id: req.user?.id ?? 0
    })
    .first()

  if (!list) {
    req.flash('warning', 'The list does not belong to the current user')

    return req.Inertia.redirect(`/list/${hash}/details`)
  }

  next()
}

async function deleteList(req: Request, res: Response, next: NextFunction) {
  const listId = httpContext.get('listId')

  const knex = Knex()

  await knex(Tables.Lists).where('id', listId).delete()

  next()
}

async function response(req: Request) {
  req.flash('success', 'List had been removed')

  req.Inertia.redirect(`/users/${req.user?.username}`)
}

export default asyncRoutes([
  isAuthenticated,
  setListIdAndHashToContext,
  ...validations,
  verifyIfListBelongsToCurrentUser,
  prepareValidationForFlashMessage((req: Request) => `/list/${req.params.hash}/details`),
  deleteList,
  response
])
