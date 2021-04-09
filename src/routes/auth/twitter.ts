import { Router } from 'express'
import Passport from 'passport'

const router = Router({
  mergeParams: true
})

// Route /auth/twitter

router.get('/', Passport.authenticate('twitter'))

router.get(
  '/callback',
  Passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/auth/login', session: true }),
  function (req, res) {
    res.redirect('/')
  }
)

export default router
