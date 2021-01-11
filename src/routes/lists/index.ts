import { Router } from 'express'
import list from './list'
import details from './details'
import deleteList from './delete'
import create from './create'
import edit from './edit'
import add from './add'
import video from './video'

const router = Router()

// Route /list

router.get('/', list)

router.get('/add', add)

router.post('/', create)

router.get('/:listId/edit', edit)

router.get('/:id', details)

router.delete('/:listId', deleteList)

router.use('/:listId/video', video)

export default router
