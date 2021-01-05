import { Router, Request, Response } from 'express'
import { checkToken } from '../middlewares/cookies'

const router = Router()

router.get('/', checkToken, function (req: Request, res: Response) {
  res.redirect('/events/')
})

export default router
