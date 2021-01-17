import { Router } from 'express'
import view from './view'
import create from './create'
import destroy from './destroy'

const router = Router({
  mergeParams: true
})

router.get('/', view)

router.post('/', create)

router.post('/destroy', destroy)

export default router
