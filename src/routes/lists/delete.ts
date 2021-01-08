import { Request, Response, NextFunction } from 'express'
import { queryDeleteListById } from '../../queries/list'

async function deleteList(req: Request, res: Response, next: NextFunction) {
  const params = req.params

  await queryDeleteListById(parseInt(params.listId, 10))

  next()
}

async function response(req: Request, res: Response, next: NextFunction) {
  req.flash('success', 'List deleted successfully')
  req.method = 'GET'

  req.flash('success', 'List had been removed')

  const referer = req.get('referer')

  if (referer) {
    res.redirect(303, referer)
  } else {
    res.redirect(303, '/profile/lists')
  }
}

export default [deleteList, response]
