import { Router } from 'express'
import view from './view'
// import create from './create'

const router = Router({
  mergeParams: true
})

// Route: /auth/login

router.get('/', view)

// router.post('/', create)

export default router
