import { Router, Request } from 'express'
import Passport from 'passport'

const router = Router({
  mergeParams: true
})

router.get('/login', function view(req: Request) {
  req.Inertia.setViewData({ title: 'Log in' }).render({
    component: 'Auth/Session'
  })
})

router.get('/auth/google', Passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get(
  '/auth/google/callback',
  Passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login', session: true }),
  function (req, res) {
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

export default router
