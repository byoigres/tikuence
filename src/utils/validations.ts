import { ParamSchema } from 'express-validator'
import Knex, { Tables } from './knex'
import { getListIdFromHash } from '../middlewares/utils'

export const paramSchemaTitle: ParamSchema = {
  in: 'body',
  errorMessage: 'You must provide a title for the list',
  isLength: {
    options: {
      min: 1,
      max: 150
    }
  }
}

export const paramSchemaListBelongsToAuthUser: ParamSchema = {
  in: 'params',
  matches: {
    errorMessage: 'The provided hash of the list is not valid',
    options: /[A-Za-z0-9_]{8,15}/
  },
  custom: {
    options: async (value, { req, path }) => {
      console.log({ req, path })
      const knex = Knex()
      try {
        const listId = getListIdFromHash(value)

        if (!listId) {
          return Promise.reject("The list don't exists")
        }

        const list = await knex(`${Tables.Lists} AS L`)
          .select('L.user_id')
          .join(`${Tables.Users} AS U`, 'L.user_id', 'U.id')
          .where('L.id', listId)
          .first()

        if (!list) {
          /* eslint prefer-promise-reject-errors: 0 */
          return Promise.reject('The list does not exists')
        }

        if (list.user_id !== req.user?.id) {
          return Promise.reject("You don't have permission to modify this list")
        }
      } catch (err) {
        console.log(err)
        return Promise.reject(err)
      }
    }
  }
}

export const paramSchemaCategories: ParamSchema = {
  in: 'body',
  errorMessage: 'You must select at least one category',
  isArray: {
    options: {
      min: 1,
      max: 3
    },
    bail: true
  },
  customSanitizer: {
    options: async (values: string[]) => {
      const knex = Knex()

      const ids = await knex(Tables.Categories).select('id', 'identifier').whereIn('identifier', values)

      if (ids.length === values.length) {
        return ids.map((x) => x.id)
      }

      return Promise.reject(new Error("The selected categories weren't valid."))
    }
  }
}

export const paramSchemaLanguages: ParamSchema = {
  in: 'body',
  errorMessage: 'You must select at least one language',
  isArray: {
    options: {
      min: 1,
      max: 2
    },
    bail: true
  },
  customSanitizer: {
    options: async (values) => {
      const knex = Knex()

      const ids = await knex(Tables.Languages).select('id', 'code').whereIn('code', values)

      if (ids.length === values.length) {
        return ids.map((x) => x.id)
      }

      return Promise.reject(new Error("The selected languages weren't valid."))
    }
  }
}
