import { Router, Request, Response } from 'express'
import Passport from 'passport'
import completeRegistration from './completeRegistration'

const router = Router({
  mergeParams: true
})

router.get('/register/:token', completeRegistration)

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
  res.redirect('/auth/login')
})

router.get('/google', Passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get(
  '/google/callback',
  Passport.authenticate('google', { failureRedirect: '/auth/login', session: true }),
  function (req, res) {
    if (req.isAuthenticated()) {
      if (req.user.pendingRegistrationToken && typeof req.user.pendingRegistrationToken === 'string') {
        const token = req.user.pendingRegistrationToken
        req.logOut()
        return res.redirect(`/auth/register/${token}`)
      }

      return res.redirect('/')
    }

    res.redirect('/')
  }
)

router.get('/twitter', Passport.authenticate('twitter'))

router.get(
  '/twitter/callback',
  Passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/auth/login', session: true }),
  function (req, res) {
    res.redirect('/')
  }
)

router.post('/local', Passport.authenticate('local', { successRedirect: '/', failureRedirect: '/auth/login' }))

export default router
