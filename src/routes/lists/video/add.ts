import { Request } from 'express'
import { isAuthenticated } from '../../../middlewares/inertia'

function response (req: Request) {
  const params = req.params

  req.Inertia.setViewData({ title: 'Add new video' }).render({
    component: 'Lists/Details',
    props: {
      modal: {
        modalName: 'add-video',
        listId: params.listId
      }
    }
  })
}

export default [isAuthenticated, response]
