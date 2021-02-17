import { Request } from 'express'
import { isAuthenticated } from '../../middlewares/inertia'
import User from '../../models/user.model'

async function response(req: Request) {
  const user = await User.findOne({
    where: {
      email: 'byoigres@gmail.com'
    },
    attributes: ['email']
  })

  req.Inertia.setViewData({ title: 'Profile' }).render({
    component: 'Lists/List',
    props: {
      user,
      displayProfile: true
    }
  })
}

export default [isAuthenticated, response]
