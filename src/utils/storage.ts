import fsPromises from 'fs/promises'
import Os from 'os'
import fetch from 'node-fetch'
import Sharp from 'sharp'
import path from 'path'
import { upload as uploadImage } from './firebase'
import { getThumbnailsNames } from '../utils/images'

export async function fetchAndCreateVideoThumbnails(url: string, imageHash: string) {
  const response = await fetch(url)
  const buffer = await response.buffer()
  const imageNames = getThumbnailsNames(imageHash)

  const imagePaths = Object.entries(imageNames).reduce((acc, [size, name]) => {
    acc[size] = path.join(Os.tmpdir(), name)
    return acc
  }, {} as Record<string, string>)

  const transformer = Sharp(buffer)
  await transformer.clone().toFile(imagePaths.original)
  await transformer.clone().resize({ height: 100 }).toFile(imagePaths.small)
  await transformer.clone().resize({ height: 250 }).toFile(imagePaths.medium)
  await transformer.clone().resize({ height: 400 }).toFile(imagePaths.large)

  await uploadImage(imagePaths.small, imageNames.small)
  await uploadImage(imagePaths.medium, imageNames.medium)
  await uploadImage(imagePaths.large, imageNames.large)
  await uploadImage(imagePaths.original, imageNames.original)

  await fsPromises.rm(imagePaths.small)
  await fsPromises.rm(imagePaths.medium)
  await fsPromises.rm(imagePaths.large)
  await fsPromises.rm(imagePaths.original)
}
