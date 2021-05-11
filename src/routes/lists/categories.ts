import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import asyncRoutes from '../../utils/asyncRoutes'
import Knex, { Tables } from '../../utils/knex'
import { setListIdAndHashToContext } from '../../middlewares/utils'
import { isAuthenticated } from '../../middlewares/inertia'
import { getCategories } from '../categories/list'

export async function getCategoriesFromList(req: Request, res: Response, next: NextFunction) {
  const listId = httpContext.get('listId')
  const knex = Knex()

  const categories = await knex(`${Tables.ListsCategories} AS LC`)
    .select('C.identifier')
    .join(`${Tables.Categories} AS C`, 'LC.category_id', 'C.id')
    .where('LC.list_id', listId)

  httpContext.set(
    'list_categories',
    categories.map((x) => x.identifier)
  )

  next()
}

function response(req: Request) {
  const listId = httpContext.get('hash')
  const selected = httpContext.get('list_categories')
  const categories = httpContext.get('categories')

  req.Inertia.setViewData({ title: 'Change categories' }).render({
    component: 'Lists/Details',
    props: {
      modal: {
        modalName: 'edit-categories',
        listId,
        selected,
        categories
      }
    }
  })
}

export default asyncRoutes([isAuthenticated, setListIdAndHashToContext, getCategories, getCategoriesFromList, response])
