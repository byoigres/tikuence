import { Router, Request, Response } from 'express'
import Passport from 'passport'
import Knex, { Tables } from '../../utils/knex'

const router = Router({
  mergeParams: true
})

router.get('/register/:token', async function view(req: Request, res: Response) {
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
})

router.get('/login', function view(req: Request) {
  if (req.isAuthenticated()) {
    return req.Inertia.redirect('/')
  }

  req.Inertia.setViewData({ title: 'Log in' }).render({
    component: 'Lists/List',
    props: {
      showModal: 'login'
    }
  })
})

router.get('/logout', function logout(req: Request, res: Response) {
  req.logOut()
  res.redirect('/login')
})

router.get('/auth/google', Passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get(
  '/auth/google/callback',
  Passport.authenticate('google', { failureRedirect: '/login', session: true }),
  function (req, res) {
    if (req.isAuthenticated()) {
      if (req.user.pendingRegistrationToken && typeof req.user.pendingRegistrationToken === 'string') {
        const token = req.user.pendingRegistrationToken
        req.logOut()
        return res.redirect(`/register/${token}`)
      }

      return res.redirect('/')
    }

    res.redirect('/')
  }
)

router.get('/auth/twitter', Passport.authenticate('twitter'))

router.get(
  '/auth/twitter/callback',
  Passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login', session: true }),
  function (req, res) {
    res.redirect('/')
  }
)

router.post('/auth/local', Passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }))

export default router
