import { Request, Response } from 'express'
import stream from 'stream'
import { getFile } from '../firebase'

async function image(req: Request, res: Response) {
  const { image } = req.params
  const file = await getFile(image)
  const readStream = new stream.PassThrough()

  readStream.end(file.buffer)
  res.set('Content-Type', file.type)
  readStream.pipe(res)
}

export default [image]
