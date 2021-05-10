import { Router } from 'express'
// import list from './list'
import list from './list'
import deleteList from './delete'
import create from './create'
import favorite from './favorite'
import details from './details'
import update from './update'
import add from './add'
import video from './video'
import cover from './cover'
import categories from './categories'
import updateCategories from './updateCategories'

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

// Create new list endpoint
router.post('/:hash/favorite', favorite)

// Set cover for list
router.post('/:hash/cover', cover)

if (process.env.NODE_ENV !== 'production') {
  // Display edit list categories modal
  router.get('/:hash/categories', categories)
  // Update categories for list
  router.post('/:hash/categories', updateCategories)
}

// List details view
router.get('/:hash/details', details)

// Display lists videos view
router.get('/:hash', list)

router.put('/:hash', update)

// Delete a list endpoint
router.delete('/:hash', deleteList)

// list/:listId/video endpoints
router.use('/:hash/video', video)

export default router
