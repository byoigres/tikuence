import { Request, Response } from 'express'
import stream from 'stream'
import { getFile } from '../firebase'

async function image(req: Request, res: Response) {
  const { image } = req.params
  try {
    const file = await getFile(image)
    const readStream = new stream.PassThrough()

    readStream.end(file.buffer)
    res.set('Content-Type', file.type)
    readStream.pipe(res)
  } catch (err) {
    if (err.code === 404) {
      req.Inertia.setStatusCode(404).setViewData({ title: 'Page not found' }).render({
        component: 'Errors/404',
        props: {}
      })
    } else {
      req.Inertia.setStatusCode(500).setViewData({ title: 'Something goes wrong' }).render({
        component: 'Errors/500',
        props: {}
      })
    }
  }
}

export default [image]
