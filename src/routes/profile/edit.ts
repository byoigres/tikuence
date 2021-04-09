import { Request } from 'express'
import httpContext from 'express-http-context'
import { isAuthenticated } from '../../middlewares/inertia'
import asyncRoutes from '../../utils/asyncRoutes'
import { setUser, setIsMe } from './profile'

async function response(req: Request) {
  const user = httpContext.get('user')
  const isMe = httpContext.get('isMe')

  req.Inertia.setViewData({ title: 'Edit my Profile' }).render({
    component: 'Profile/Profile',
    props: {
      user,
      isMe,
      modal: {
        modalName: 'edit-profile'
      }
    }
  })
}

export default asyncRoutes([isAuthenticated, setIsMe, setUser, response])
