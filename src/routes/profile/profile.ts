import { Request } from 'express'
import Knex, { Tables } from '../../utils/knex'

async function response(req: Request) {
  const params = req.params
  const knex = Knex()

  const fields: string[] = ['id', 'name', 'username']

  if (req.isAuthenticated()) {
    fields.push('email')
  }

  const user = await knex(Tables.Users).select(...fields).where('username', params.username).first()
  const isMe = req.isAuthenticated() && req.params.username === req.user.username

  req.Inertia.setViewData({ title: 'Profile' }).render({
    component: 'Profile/Profile',
    props: {
      user,
      isMe,
      showModal: 'profile'
    }
  })
}

export default [response]
