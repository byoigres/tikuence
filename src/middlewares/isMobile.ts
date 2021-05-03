import { Request, Response, NextFunction } from 'express'
import checkIsMobile from 'is-mobile'

export default function populateSharedProps(req: Request, res: Response, next: NextFunction) {
  const isMobile = checkIsMobile({ ua: req })

  if (req.cookies && req.cookies._tkuad !== isMobile) {
    res.cookie('_tkuad', isMobile, { httpOnly: false })
  }
  next()
}
