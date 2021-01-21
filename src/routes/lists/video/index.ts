import { Router } from 'express'
import add from './add'
import append from './append'
import deleteVideo from './delete'
import updateVideo from './update'

const router = Router({
  mergeParams: true
})

// Route /list/:listId/video

router.get('/add', add)

router.post('/', append)

router.delete('/:videoId', deleteVideo)

router.post('/:videoId', updateVideo)

export default router
