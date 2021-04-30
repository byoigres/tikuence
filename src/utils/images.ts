import config from '../config'

export enum ThumbnailSize {
  Original = '',
  Sm = 'sm-',
  Md = 'md-',
  Lg = 'lg-'
}

export function getThumbnailsNames(imageHash: string) {
  return {
    small: `${ThumbnailSize.Sm}${imageHash}.jpg`,
    medium: `${ThumbnailSize.Md}${imageHash}.jpg`,
    large: `${ThumbnailSize.Lg}${imageHash}.jpg`,
    original: `${imageHash}.jpg`
  }
}

export function createThumbnailUrl(thumbnail: string, size: ThumbnailSize = ThumbnailSize.Original) {
  const url = `${process.env.NODE_ENV === 'production' ? config.get('/url/base') : '/'}images/${size}${thumbnail}.jpg`
  return url
}

export function createThumbnailsUrl(thumbnail: string) {
  const imageNames: { [key: string]: string } = getThumbnailsNames(thumbnail)

  const sizes: { [key: string]: string } = {
    small: '360',
    medium: '600',
    large: '900'
  }

  const createThumbnailURL = (name: string) => `/images/${name}`

  const imagePaths = Object.entries(sizes).map(([size, dimension]) => {
    return `${createThumbnailURL(imageNames[size])} ${dimension}w`
  })

  return {
    name: createThumbnailURL(imageNames.original),
    sizes: imagePaths.join(', ')
  }
}
