import { Request } from 'express'
import { getAllLists } from '../lists/list'
import User from '../../models/user.model'

async function response(req: Request) {
  const user = await User.findOne({
    where: {
      email: 'byoigres@gmail.com'
    },
    attributes: ['email']
  })

  req.Inertia.setViewData({ title: 'Profile' }).render({
    component: 'Profile/Profile',
    props: {
      user
    }
  })
}

export default [getAllLists, response]
