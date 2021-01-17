import { Request } from 'express'
import httpContext from 'express-http-context'
import { isAuthenticated } from '../../middlewares/inertia'
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

export default [isAuthenticated, getAllLists, response]
