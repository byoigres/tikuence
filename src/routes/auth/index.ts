import { Router, Request } from 'express'
import Passport from 'passport'

const router = Router({
  mergeParams: true
})

router.get('/login', function view(req: Request) {
  if (req.isAuthenticated()) {
    return req.Inertia.redirect('/')
  }

  req.Inertia.setViewData({ title: 'Log in' }).render({
    component: 'Auth/Session'
  })
})

router.get('/logout', function logout(req: Request) {
  req.logOut()
  return req.Inertia.redirect('/login')
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

router.post('/auth/local', Passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }))

export default router
