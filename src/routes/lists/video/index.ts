import { Router } from 'express'
import add from './add'
import append from './append'
import deleteVideo from './delete'
import updateVideo from './update'
import view from './view'

const router = Router({
  mergeParams: true
})

// Route /list/:listId/video

router.get('/add', add)

router.get('/:videoId', view)

router.post('/', append)

router.delete('/:videoHash', deleteVideo)

router.post('/:videoHash', updateVideo)

export default router
