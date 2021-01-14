import { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

const cookies = cookieParser('my super secret code')

export default cookies
