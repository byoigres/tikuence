import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import List from '../../../models/list.model'

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

function response (req: Request) {
  const listId: List = httpContext.get('listId')

  console.log('ID:', listId)

  req.Inertia.setViewData({ title: 'Add new list' }).render({
    component: 'Lists/Add',
    props: {}
  })
}

export default [createList, response]
