import { ParamSchema } from 'express-validator'
import Knex, { Tables } from './knex'

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
