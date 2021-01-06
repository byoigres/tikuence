import { Router } from 'express'
import list from './lists'

const router = Router()

// Route /list

router.get('/lists', list)

export default router
