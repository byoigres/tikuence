import { Router } from 'express'
import view from './view'
import token from './token'
import create from './create'

const router = Router({
  mergeParams: true
})

// Route: /auth/register

router.get('/', view)

router.get('/:token', token)

router.post('/', create)

export default router
