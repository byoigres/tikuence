import { Request, Response } from 'express'
import { checkToken } from '../../middlewares/cookies'

function destroy(_req: Request, res: Response) {
  res.clearCookie('ssid')
  res.redirect('/sessions')
}

export default [checkToken, destroy]
