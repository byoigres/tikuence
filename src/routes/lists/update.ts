import { Request, Response, NextFunction } from 'express'
import { isAuthenticated } from '../../middlewares/inertia'
import List from '../../models/list.model'

async function updateList(req: Request, _res: Response, next: NextFunction) {
  const { listId } = req.params
  const { title } = req.body

  await List.update(
    {
      title
    },
    {
      where: {
        id: listId
      }
    }
  )

  next()
}

async function response(req: Request) {
  const { listId } = req.params

  req.flash('success', 'Title updated successfully')
  req.Inertia.redirect(`/list/${listId}/edit`)
}

export default [isAuthenticated, updateList, response]
