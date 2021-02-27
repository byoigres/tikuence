import { Router } from 'express'
import Passport from 'passport'

const router = Router({
  mergeParams: true
})

// Route /auth/local

router.post('/', Passport.authenticate('local', { successRedirect: '/', failureRedirect: '/auth/login' }))

export default router
