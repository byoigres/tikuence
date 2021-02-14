import * as admin from 'firebase-admin'
import config from '../config'

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.get('/firebase/cert/projectId'),
    privateKey: config.get('/firebase/cert/privateKey'),
    clientEmail: config.get('/firebase/cert/clientEmail')
  })
})

const storage = admin.storage(admin.app())

const getBucket = () => storage.bucket(config.get('/firebase/bucketUrl'))

export async function upload(filepath: string, fileName: string) {
  const bucket = getBucket()

  const [, { mediaLink }] = await bucket.upload(filepath, {
    destination: `${config.get('/firebase/bucketFolder')}/${fileName}`,
    public: true
  })

  return mediaLink
}

export async function getFile(fileName: string) {
  const bucket = getBucket()

  const file = bucket.file(`${config.get('/firebase/bucketFolder')}/${fileName}`)

  const [data] = await file.download()

  return {
    buffer: data,
    type: file.metadata.contentType,
    name: file.metadata.name,
    size: file.metadata.size
  }
}
