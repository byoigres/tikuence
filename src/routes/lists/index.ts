import { Router } from 'express'
// import list from './list'
import list from './list'
import deleteList from './delete'
import create from './create'
import edit from './edit'
import update from './update'
import add from './add'
import video from './video'

const router = Router({
  mergeParams: true
})

// Route /list

// List all lists view
// router.get('/', list)

// Add new list view
router.get('/add', add)

// Create new list endpoint
router.post('/', create)

// Edit list view
router.get('/:listId/edit', edit)

// Display lists videos view
router.get('/:listId', list)

router.put('/:listId', update)

// Delete a list endpoint
router.delete('/:listId', deleteList)

// list/:listId/video endpoints
router.use('/:listId/video', video)

export default router
