import { Request, Response } from 'express'
import Knex, { Tables } from '../../utils/knex'

export default async function view(req: Request, res: Response) {
  if (req.params.token && typeof req.params.token === 'string') {
    const knex = Knex()

    const pending = await knex(Tables.PendingUsers)
      .select<{
        email: string
        expiresAt: Date
      }>('email', 'expires_at AS expiresAt')
      .where('token', req.params.token)
      .first()

    if (pending) {
      if (pending.expiresAt > new Date()) {
        return req.Inertia.render({
          component: 'Auth/Register',
          props: {
            email: pending.email
          }
        })
      } else {
        return req.Inertia.render({
          component: 'Auth/Register',
          props: {
            isExpired: true
          }
        })
      }
    }

    return req.Inertia.render({
      component: 'Auth/Register',
      props: {
        isInvalid: true
      }
    })
  }

  res.redirect('/')
}
