import { Request } from 'express'
import { isAuthenticated } from '../../middlewares/inertia'

function response (req: Request) {
  const referer = req.headers['x-page-referer']
  let component = 'Feed'

  if (referer && typeof referer === 'string') {
    if (referer === 'profile') {
      component = 'Profile/Profile'
    } else if (referer === 'details') {
      component = 'Lists/Details'
    }
  }

  req.Inertia.setViewData({ title: 'Add new list' }).render({
    component,
    props: {
      modal: {
        modalName: 'add-list',
        referer: 'feed'
      }
    }
  })
}

export default [isAuthenticated, response]
