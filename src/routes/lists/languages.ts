import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import asyncRoutes from '../../utils/asyncRoutes'
import Knex, { Tables } from '../../utils/knex'
import { setListIdAndHashToContext } from '../../middlewares/utils'
import { isAuthenticated } from '../../middlewares/inertia'
import { getLanguages } from '../languages/list'

export async function getLanguagesFromList(req: Request, res: Response, next: NextFunction) {
  const listId = httpContext.get('listId')
  const knex = Knex()

  const languages = await knex(`${Tables.ListsLanguages} AS LL`)
    .select('L.code')
    .join(`${Tables.Languages} AS L`, 'LL.language_id', 'L.id')
    .where('LL.list_id', listId)

  httpContext.set(
    'list_languages',
    languages.map((x) => x.code)
  )

  next()
}

function response(req: Request) {
  const listId = httpContext.get('hash')
  const selected = httpContext.get('list_languages')
  const languages = httpContext.get('languages')

  req.Inertia.setViewData({ title: 'Change languages' }).render({
    component: 'Lists/Details',
    props: {
      modal: {
        modalName: 'edit-languages',
        listId,
        selected,
        languages
      }
    }
  })
}

export default asyncRoutes([isAuthenticated, setListIdAndHashToContext, getLanguages, getLanguagesFromList, response])
