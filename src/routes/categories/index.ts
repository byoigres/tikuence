import { Router } from 'express'
import list from './list'
import view from './view'

const router = Router({
  mergeParams: true
})

// Route /categories

// Get all lists
router.get('/', list)
router.get('/:identifier', view)

export default router
