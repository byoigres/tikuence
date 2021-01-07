import { Request, Response, NextFunction } from 'express'

async function response(req: Request, res: Response, next: NextFunction) {
  req.flash('success', 'List deleted successfully')
  req.method = 'GET'
  const referer = req.get('referer')

  if (referer) {
    res.redirect(303, referer)
  } else {
    res.redirect(303, '/profile/lists')
  }
}

export default [response]
