import { Request, Response } from 'express'
import { isAuthenticated } from '../../middlewares/inertia'

function destroy(_req: Request, res: Response) {
  res.clearCookie('ssid')
  res.redirect('/sessions')
}

export default [isAuthenticated, destroy]
