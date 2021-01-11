import { Request, Response, NextFunction } from 'express'

export function configureReturnUrl(req: Request, res: Response, next: NextFunction) {
  function returnUrl() {
    const params = `?returnUrl=${encodeURIComponent(req.query.returnUrl ? req.query.returnUrl as string : '')}`

    return params
  }

  req.returnUrl = returnUrl

  next()
}

export default configureReturnUrl
