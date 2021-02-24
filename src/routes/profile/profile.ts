import { Request } from 'express'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex from '../../utils/knex'

async function response(req: Request) {
  const knex = Knex()

  const user = await knex('public.users').select('email').first()

  req.Inertia.setViewData({ title: 'Profile' }).render({
    component: 'Lists/List',
    props: {
      user,
      showModal: 'profile'
    }
  })
}

export default [isAuthenticated, response]
