import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import { getLists } from './list'
import List from '../../models/list.model'

interface iPayload {
  title: string
}

async function createList (req: Request, _res: Response, next: NextFunction) {
  const payload = <iPayload>req.body

  const list = await List.create({
    title: payload.title,
    user_id: 1
  })

  console.log('new list', list)

  httpContext.set('listId', list.id)

  next()
}

function response (req: Request, res: Response) {
  const listId: List = httpContext.get('listId')
  const lists: List[] = httpContext.get('lists')

  console.log('ID:', listId)

  req.flash("success", "List created successfully")

  res.redirect('/')
}

export default [createList, getLists, response]
