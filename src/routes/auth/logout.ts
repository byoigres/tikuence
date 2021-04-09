import { Router, Request, Response } from 'express'

const router = Router({
  mergeParams: true
})

// Route /auth/logout

router.get('/', function logout(req: Request, res: Response) {
  req.logOut()
  res.redirect('/')
})

export default router
