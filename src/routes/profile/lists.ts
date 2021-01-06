import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import { getAllLists } from '../lists/list'
import List from '../../models/list.model'

async function response(req: Request) {
  const lists: List[] = httpContext.get('lists')

  req.Inertia.setViewData({ title: 'My lists' }).render({
    component: 'Profile/Lists',
    props: {
      lists
    }
  })
}

export default [getAllLists, response]
