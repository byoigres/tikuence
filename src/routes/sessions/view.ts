import { Request } from 'express'

function view(req: Request) {
  req.Inertia.setViewData({ title: 'Log in' }).render({
    component: 'Auth/Session'
  })
}

export default view
