import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import Knex, { Tables } from '../../utils/knex'
import asyncRoutes from '../../utils/asyncRoutes'

async function getCategory(req: Request, res: Response, next: NextFunction) {
  const { identifier } = req.params
  const knex = Knex()

  const lists = await knex(`${Tables.Lists} AS L`)
    .select('L.id', 'L.title')
    .join(`${Tables.ListsCategories} AS LC`, 'L.id', 'LC.list_id')
    .join(`${Tables.Categories} AS C`, 'LC.category_id', 'C.id')
    .where('C.identifier', identifier)

  httpContext.set('lists', lists)

  next()
}
async function response(req: Request) {
  const lists = httpContext.get('lists')
  req.Inertia.setViewData({ title: 'Categories' }).render({
    component: 'Categories/View',
    props: {
      lists
    }
  })
}

export default asyncRoutes([getCategory, response])
