import { Router } from 'express'
import Passport from 'passport'

const router = Router({
  mergeParams: true
})

// Route /auth/google

router.get('/', Passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get(
  '/callback',
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

export default router
