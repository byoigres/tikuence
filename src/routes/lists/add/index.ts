import { Router } from 'express'
import view from './view'
import add from './add'
import video from './video'

const router = Router()

router.get('/', view)
router.post('/', add)
router.post('/video', video)

export default router
