import { Request } from 'express'
import Knex, { Tables } from '../../utils/knex'

async function response(req: Request) {
  const params = req.params
  const knex = Knex()

  const user = await knex(Tables.Users).select('id', 'email').where('email', params.email).first()
  const isMe = req.isAuthenticated() && req.params.email === req.user.email

  req.Inertia.setViewData({ title: 'Profile' }).render({
    component: 'Lists/List',
    props: {
      user,
      isMe,
      showModal: 'profile'
    }
  })
}

export default [response]
