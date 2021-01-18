import { Request } from 'express'
import httpContext from 'express-http-context'
import { getAllLists } from '../lists/list'
import { isAuthenticated } from '../../middlewares/inertia'
import User from '../../models/user.model'
import List from '../../models/list.model'

async function response(req: Request) {
  const lists: List[] = httpContext.get('lists')

  const user = await User.findOne({
    where: {
      email: 'byoigres@gmail.com'
    },
    attributes: ['email']
  })

  req.Inertia.setViewData({ title: 'Profile' }).render({
    component: 'Profile/Profile',
    props: {
      user,
      lists
    }
  })
}

export default [isAuthenticated, getAllLists, response]
