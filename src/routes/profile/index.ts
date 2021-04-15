import { Router } from 'express'
import profile from './profile'
import edit from './edit'
import update from './update'
// import list from './_lists'

const router = Router({
  mergeParams: true
})

// Route /list

router.get('/', profile)

router.get('/edit', edit)

router.post('/edit', update)

// router.get('/lists', list)

export default router
