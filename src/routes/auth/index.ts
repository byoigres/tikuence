import { Router } from 'express'

import login from './login'
import register from './register'
import logout from './logout'
import google from './google'
import twitter from './twitter'
import local from './local'

const router = Router({
  mergeParams: true
})

// Route /auth

router.use('/login', login)

router.use('/register', register)

router.use('/logout', logout)

router.use('/google', google)

router.use('/twitter', twitter)

router.use('/local', local)

export default router
