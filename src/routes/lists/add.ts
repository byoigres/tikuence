import { Request } from 'express'
import httpContext from 'express-http-context'
import asyncRoutes from '../../utils/asyncRoutes'
import { isAuthenticated } from '../../middlewares/inertia'
import { getCategories } from '../categories/list'
import { getLanguages } from '../languages/list'

function response (req: Request) {
  const referer = req.headers['x-page-referer']
  const categories = httpContext.get('categories')
  const languages = httpContext.get('languages')

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
        referer: 'feed',
        categories,
        languages
      }
    }
  })
}

export default asyncRoutes([
  isAuthenticated,
  getCategories,
  getLanguages,
  response
])
