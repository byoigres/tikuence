import { Request, Response, NextFunction } from 'express'
import { isAuthenticated } from '../../middlewares/inertia'
import { queryDeleteListById } from '../../queries/list'

async function deleteList(req: Request, res: Response, next: NextFunction) {
  const params = req.params

  await queryDeleteListById(parseInt(params.listId, 10))

  next()
}

async function response(req: Request, res: Response) {
  req.flash('success', 'List had been removed')
  req.Inertia.redirect('/profile/lists')
}

export default [isAuthenticated, deleteList, response]
