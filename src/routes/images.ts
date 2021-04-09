import { Request, Response } from 'express'
import stream from 'stream'
import { getFile } from '../utils/firebase'

async function image(req: Request, res: Response) {
  const { image } = req.params
  try {
    // TODO: Remove .jpg
    const file = await getFile(`${image}.jpg`)
    const readStream = new stream.PassThrough()

    readStream.end(file.buffer)
    res.set('Content-Type', file.type)
    /**
     * The max-age directive tells the browser how long it should cache the
     * resource in seconds. This example sets the duration to 31536000, which
     * corresponds to 1 year: 60 seconds × 60 minutes × 24 hours × 365 days
     * = 31536000 seconds.
     * @see https://web.dev/uses-long-cache-ttl/#:~:text=When%20a%20browser%20requests%20a,getting%20it%20from%20the%20network.
     */
    res.set('Cache-Control', 'max-age=31536000')
    readStream.pipe(res)
  } catch (err) {
    if (err.code === 404) {
      req.Inertia.setStatusCode(404).setViewData({ title: 'Page not found' }).render({
        component: 'Errors/404'
      })
    } else {
      req.Inertia.setStatusCode(500).setViewData({ title: 'Something goes wrong' }).render({
        component: 'Errors/500'
      })
    }
  }
}

export default [image]
