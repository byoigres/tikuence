import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import { checkSchema } from 'express-validator'
import asyncRoutes from '../../utils/asyncRoutes'
import { prepareValidationForErrorMessages } from '../../middlewares/validations'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex, { Tables } from '../../utils/knex'
import UrlHash, { LIST_MODIFIER } from '../../utils/urlHash'

interface iPayload {
  title: string
  categories: number[]
  languages: number[]
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
  },
  categories: {
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
      options: async (values) => {
        const knex = Knex()

        const ids = await knex(Tables.Categories).select('id', 'identifier').whereIn('identifier', values)

        if (ids.length === values.length) {
          return ids.map((x) => x.id)
        }

        return Promise.reject(new Error("The selected categories weren't valid."))
      }
    }
  },
  languages: {
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
})

async function createList(req: Request, res: Response, next: NextFunction) {
  const payload = <iPayload>req.body

  const knex = Knex()

  const transaction = await knex.transaction()

  try {
    const [listId] = await knex(Tables.Lists)
      .transacting(transaction)
      .insert({
        title: payload.title,
        user_id: req.user!.id
      })
      .returning<[number]>('id')

    const urlHash = UrlHash.encode(listId, LIST_MODIFIER)

    await knex(Tables.Lists)
      .transacting(transaction)
      .update({
        url_hash: urlHash
      })
      .where({
        id: listId
      })

    const categories = payload.categories.map((categoryId: number) => ({
      list_id: listId,
      category_id: categoryId,
      created_at: new Date(),
      updated_at: new Date()
    }))

    await knex.batchInsert(Tables.ListsCategories, categories).transacting(transaction)

    const listLanguages = payload.languages.map((languageId: number) => ({
      list_id: listId,
      language_id: languageId,
      created_at: new Date(),
      updated_at: new Date()
    }))

    await knex.batchInsert(Tables.ListsLanguages, listLanguages).transacting(transaction)

    await transaction.commit()

    httpContext.set('urlHash', urlHash)
  } catch (err) {
    await transaction.rollback()
    throw err
  }

  next()
}

async function response(req: Request) {
  const urlHash: string = httpContext.get('urlHash')

  req.flash('success', 'List created successfully')

  req.Inertia.redirect(`/list/${urlHash}/details`)
}

export default asyncRoutes([
  isAuthenticated,
  ...validations,
  prepareValidationForErrorMessages('/list/add'),
  createList,
  response
])
