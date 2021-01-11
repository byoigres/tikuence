import { Router } from 'express'
import add from './add'
import append from './append'
import deleteVideo from './delete'

const router = Router({
  mergeParams: true
})

// Route /list/:listId/video

router.get('/add', add)

router.post('/', append)

router.delete('/:videoId', deleteVideo)

export default router
