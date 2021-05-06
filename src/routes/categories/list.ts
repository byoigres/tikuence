import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import Knex, { Tables } from '../../utils/knex'
import asyncRoutes from '../../utils/asyncRoutes'

async function getCategories(req: Request, res: Response, next: NextFunction) {
  const knex = Knex()

  const categories = await knex(Tables.Categories).select('id', 'description', 'identifier')

  httpContext.set('categories', categories)

  next()
}
async function response(req: Request) {
  const categories = httpContext.get('categories')
  req.Inertia.setViewData({ title: 'Categories' }).render({
    component: 'Categories/Categories',
    props: {
      categories
    }
  })
}

export default asyncRoutes([getCategories, response])
