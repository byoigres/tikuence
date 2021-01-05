import { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'

export function checkToken(req: Request, res: Response, next: NextFunction) {
  // get authcookie from request
  const data = req.cookies.ssid

  // verify token which is in cookie value
  if (data && data.id) {
    req.auth = {
      isAuthenticated: true,
      credentials: data
    }

    return next()
  } else {
    res.redirect('/sessions')
  }
}

const cookies = cookieParser('my super secret code')

export default cookies
