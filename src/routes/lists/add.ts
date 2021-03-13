import { Request } from 'express'
import { isAuthenticated, getReferer } from '../../middlewares/inertia'

function response (req: Request) {
  const referer = getReferer(req)
  let component = 'Feed'

  /**
   * By now only two pages load the Add New List component,
   * if there are new pages to load this component validate
   * the else from the following validation.
   */
  if (referer && referer.startsWith('/users/')) {
    component = 'Profile/Profile'
  }

  req.Inertia.setViewData({ title: 'Add new list' }).render({
    component,
    props: {
      showModal: 'add-list'
    }
  })
}

export default [isAuthenticated, response]
