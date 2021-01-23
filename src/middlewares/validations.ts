import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export function prepareValidationForFlashMessage(redirectURL: string) {
  return function val(req: Request, _res: Response, next: NextFunction) {
    const result = validationResult(req)

    if (result.isEmpty()) {
      return next()
    }

    const errors = result.mapped()

    if (errors.listId) {
      req.flash('error', errors.listId.msg)
    }

    return req.Inertia.redirect(redirectURL)
  }
}

export function prepareValidationForErrorMessages(redirectURL : string) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const result = validationResult(req)

    if (result.isEmpty()) {
      return next()
    }

    const errors = result.array().reduce((current: { [key: string]: string }, err) => {
      current[err.param] = err.msg

      return current
    }, {})

    req.flash('errors', JSON.stringify(errors))

    return req.Inertia.redirect(redirectURL)
  }
}
