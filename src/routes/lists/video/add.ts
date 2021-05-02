import { Request } from 'express'
import asyncRoutes from '../../../utils/asyncRoutes'
import { isAuthenticated } from '../../../middlewares/inertia'

function response (req: Request) {
  const params = req.params

  req.Inertia.setViewData({ title: 'Add new video' }).render({
    component: 'Lists/Details',
    props: {
      modal: {
        modalName: 'add-video',
        listId: params.hash
      }
    }
  })
}

export default asyncRoutes([
  isAuthenticated,
  response
])
