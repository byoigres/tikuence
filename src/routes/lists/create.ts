import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import { isAuthenticated } from '../../middlewares/inertia'
import { getAllListsWithVideos } from './list'
import List from '../../models/list.model'

interface iPayload {
  title: string
}

async function createList (req: Request, res: Response, next: NextFunction) {
  const payload = <iPayload>req.body

  if (payload.title.length === 0) {
    // req.method = 'GET'

    // req.flash('error', 'You must provide a name for the list')
    req.flash(
      'errors',
      JSON.stringify({
        title: 'This field is required'
      })
    )

    return req.Inertia.redirect('/list/add')
  } else {
    const list = await List.create({
      title: payload.title,
      user_id: 1
    })

    httpContext.set('listId', list.id)

    next()
  }
}

function response (req: Request, res: Response) {
  const listId: List = httpContext.get('listId')

  req.flash('success', 'List created successfully')

  req.Inertia.redirect(`/list/${listId}/edit`)
}

export default [isAuthenticated, createList, getAllListsWithVideos, response]
