import { Router } from 'express'
import add from './add'
import append from './append'

const router = Router({
  mergeParams: true
})

// Route /list/:listId/video

router.get('/add', add)

router.post('/', append)

export default router
