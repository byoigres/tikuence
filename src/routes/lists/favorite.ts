import { Request, Response, NextFunction } from 'express'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex, { Tables } from '../../utils/knex'

/**
 * TODO: check if list belongs to the current user
 */

async function favoriteList(req: Request, _res: Response, next: NextFunction) {
  const { listId } = req.params

  const knex = Knex()

  const isListFavorite = await knex(Tables.UsersFavorites)
    .select(knex.raw('1 AS result'))
    .where('list_id', req.params.listId)
    .andWhere('user_id', req.user ? req.user.id : 0)
    .first()

  if (isListFavorite) {
    await knex(Tables.UsersFavorites)
      .where({
        user_id: req.user?.id ?? 0,
        list_id: listId
      })
      .del()

    req.flash('success', 'List removed from favorite list')
  } else {
    await knex(Tables.UsersFavorites).insert({
      user_id: req.user?.id ?? 0,
      list_id: listId
    })

    req.flash('success', 'List added to favorite list')
  }

  next()
}

async function response(req: Request) {
  const { listId } = req.params
  const referer = req.headers['x-page-referer'] || ''

  if (referer && referer === 'details') {
    return req.Inertia.setHeaders({ 'X-Page-Referer': referer }).redirect(`/list/${listId}/details`)
  } else {
    req.flash('x-page-referer', referer)
    return req.Inertia.setHeaders({ 'X-Page-Referer': referer, 'X-Test-Header': 'test' }).redirect(`/list/${listId}`)
  }
}

export default [
  isAuthenticated,
  favoriteList,
  response
]
