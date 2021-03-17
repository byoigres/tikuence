import { Router } from 'express'
import profile from './profile'
import list from './lists'

const router = Router({
  mergeParams: true
})

// Route /list

router.get('/', profile)

router.get('/lists', list)

export default router
