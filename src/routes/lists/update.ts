import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import httpContext from 'express-http-context'
import { prepareValidationForErrorMessages } from '../../middlewares/validations'
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
  const listId = httpContext.get('listId')
  const { title } = req.body

  const knex = Knex()

  await knex(Tables.Lists).update('title', title).where('id', listId)

  next()
}

async function response(req: Request) {
  const hash = httpContext.get('hash')

  req.flash('success', 'Title updated successfully')
  req.Inertia.redirect(`/list/${hash}/details`)
}

export default [
  isAuthenticated,
  setListIdAndHashToContext,
  ...validations,
  prepareValidationForErrorMessages((req: Request) => `/list/${req.params.hash}/details`),
  updateList,
  response
]
