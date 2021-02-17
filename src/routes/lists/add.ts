import { Request } from 'express'
import { isAuthenticated } from '../../middlewares/inertia'

function response (req: Request) {
  req.Inertia.setViewData({ title: 'Add new list' }).render({
    component: 'Lists/List',
    props: {
      displayAddNewList: true
    }
  })
}

export default [isAuthenticated, response]
