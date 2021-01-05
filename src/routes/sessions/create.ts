import { Request, Response, NextFunction } from 'express'
import Bcrypt from 'bcrypt'
import { Context } from '../../middlewares/context'
import User from '../../models/accounts/user.model'

interface iPayload {
  email: string
  password: string
}

interface iContextPre {
  user: User
}

async function validateUser(req: Request, _res: Response, next: NextFunction) {
  const payload = <iPayload>req.body

  const user = await User.findOne({
    where: {
      email: payload.email
    }
  })

  if (!user) {
    return req.Inertia.render({
      component: 'Auth/Session',
      error: 'User not exists'
    })
  }

  const ctx = Context.get(req)!

  ctx.pre = {
    user: user.get({ plain: true })
  }

  next()
}

async function comparePassword(req: Request, _res: Response, next: NextFunction) {
  const payload = <iPayload>req.body
  const ctx = Context.get(req)!
  const { user } = <iContextPre>ctx.pre

  const match = await Bcrypt.compare(payload.password, user.hash)

  if (!match) {
    return req.Inertia.render({
      component: 'Auth/Session',
      error: "Passwords doesn't match"
    })
  }

  next()
}

function createSession(req: Request, res: Response) {
  const ctx = Context.get(req)!
  const { user } = <iContextPre>ctx.pre
  const minute = 60000 * 30

  res.cookie(
    'ssid',
    {
      id: user.id,
      email: user.email
    },
    { maxAge: minute }
  )
  res.redirect('/')
}

export default [validateUser, comparePassword, createSession]
