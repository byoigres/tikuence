import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export default (redirectURL: string) => async (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req)

  if (result.isEmpty()) {
    next()
  }

  const errors = result.array().reduce((current: { [key: string]: string }, err) => {
    current[err.param] = err.msg

    return current
  }, {})

  req.flash('errors', JSON.stringify(errors))

  return req.Inertia.redirect(redirectURL)
}
