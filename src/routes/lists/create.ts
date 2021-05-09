import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import { checkSchema } from 'express-validator'
import asyncRoutes from '../../utils/asyncRoutes'
import { prepareValidationForErrorMessages } from '../../middlewares/validations'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex, { Tables } from '../../utils/knex'
import UrlHash, { LIST_MODIFIER } from '../../utils/urlHash'
import { paramSchemaTitle, paramSchemaCategories, paramSchemaLanguages } from '../../utils/validations'

interface iPayload {
  title: string
  categories: number[]
  languages: number[]
}

const validations = checkSchema({
  title: paramSchemaTitle,
  categories: paramSchemaCategories,
  languages: paramSchemaLanguages
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
