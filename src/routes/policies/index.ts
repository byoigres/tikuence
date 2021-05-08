import { Request, Response, Router } from 'express'

const router = Router()

// Route /policies

router.get('/:file', (req: Request, res: Response) => {
  res.redirect(`/policies/${req.params.file}.html`)
})

export default router
