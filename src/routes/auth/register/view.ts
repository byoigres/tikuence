import { Request } from 'express'

export default function view(req: Request) {
  if (req.isAuthenticated()) {
    return req.Inertia.redirect('/')
  }

  req.Inertia.setViewData({ title: 'Sign Up' }).render({
    component: 'Auth/Login',
    props: {
      isLogin: false
    }
  })
}
