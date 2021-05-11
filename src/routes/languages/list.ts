import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import Knex, { Tables } from '../../utils/knex'

export async function getLanguages(req: Request, res: Response, next: NextFunction) {
  const knex = Knex()

  const languages = await knex(Tables.Languages).select('id', 'name', 'code').orderBy('name')

  httpContext.set('languages', languages)

  next()
}
