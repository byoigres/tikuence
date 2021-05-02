import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import asyncRoutes from '../../utils/asyncRoutes'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex, { Tables } from '../../utils/knex'
import { setListIdAndHashToContext } from '../../middlewares/utils'

/**
 * TODO: check if list belongs to the current user
 */

async function favoriteList(req: Request, _res: Response, next: NextFunction) {
  const listId = httpContext.get('listId')

  const knex = Knex()

  const isListFavorite = await knex(Tables.UsersFavorites)
    .select(knex.raw('1 AS result'))
    .where('list_id', listId)
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
  const referer = req.headers['x-page-referer'] || ''

  if (referer && referer === 'details-page') {
    return req.Inertia.redirect(`/list/${req.params.hash}/details`)
  } else {
    req.flash('x-page-referer', referer)
    return req.Inertia.redirect(`/list/${req.params.hash}`)
  }
}

export default asyncRoutes([
  isAuthenticated,
  setListIdAndHashToContext,
  favoriteList,
  response
])
