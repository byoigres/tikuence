import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import httpContext from 'express-http-context'
import asyncRoutes from '../../utils/asyncRoutes'
import { prepareValidationForErrorMessages } from '../../middlewares/validations'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex, { Tables } from '../../utils/knex'
import { setListIdAndHashToContext } from '../../middlewares/utils'
import { paramSchemaListBelongsToAuthUser, paramSchemaCategories } from '../../utils/validations'

interface iPayload {
  categories: number[]
}

const validations = checkSchema({
  hash: paramSchemaListBelongsToAuthUser,
  categories: paramSchemaCategories
})

async function updateCategories(req: Request, _res: Response, next: NextFunction) {
  const listId = httpContext.get('listId')
  const payload = <iPayload>req.body
  const knex = Knex()

  const transaction = await knex.transaction()

  try {
    await knex(Tables.ListsCategories)
      .transacting(transaction)
      .whereNotIn('category_id', payload.categories)
      .andWhere('list_id', listId)
      .del()

    for await (const categoryId of payload.categories) {
      await knex(Tables.ListsCategories)
        .transacting(transaction)
        .insert({
          list_id: listId,
          category_id: categoryId,
          created_at: new Date(),
          updated_at: new Date()
        })
        .onConflict(['list_id', 'category_id'])
        .ignore()
    }

    transaction.commit()
  } catch (e) {
    transaction.rollback()
    throw e
  }

  next()
}

async function response(req: Request) {
  req.Inertia.redirect(`/list/${req.params.hash}/details`)
}

export default asyncRoutes([
  ...validations,
  prepareValidationForErrorMessages((req: Request) => `/list/${req.params.hash}/categories`),
  isAuthenticated,
  setListIdAndHashToContext,
  updateCategories,
  response
])
