import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import httpContext from 'express-http-context'
import asyncRoutes from '../../utils/asyncRoutes'
import { prepareValidationForErrorMessages } from '../../middlewares/validations'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex, { Tables } from '../../utils/knex'
import { setListIdAndHashToContext } from '../../middlewares/utils'
import { paramSchemaListBelongsToAuthUser, paramSchemaLanguages } from '../../utils/validations'

interface iPayload {
  languages: number[]
}

const validations = checkSchema({
  hash: paramSchemaListBelongsToAuthUser,
  languages: paramSchemaLanguages
})

async function updateLanguages(req: Request, _res: Response, next: NextFunction) {
  const listId = httpContext.get('listId')
  const payload = <iPayload>req.body
  const knex = Knex()

  const transaction = await knex.transaction()

  try {
    await knex(Tables.ListsLanguages)
      .transacting(transaction)
      .whereNotIn('language_id', payload.languages)
      .andWhere('list_id', listId)
      .del()

    for await (const languageId of payload.languages) {
      await knex(Tables.ListsLanguages)
        .transacting(transaction)
        .insert({
          list_id: listId,
          language_id: languageId,
          created_at: new Date(),
          updated_at: new Date()
        })
        .onConflict(['list_id', 'language_id'])
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
  prepareValidationForErrorMessages((req: Request) => `/list/${req.params.hash}/languages`),
  isAuthenticated,
  setListIdAndHashToContext,
  updateLanguages,
  response
])
