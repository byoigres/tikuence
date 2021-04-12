import config from '../config'

export enum ThumbnailSize {
  Original = '',
  Sm = 'sm-',
  Md = 'md-',
  Lg = 'lg-'
}

export function createThumbnailUrl(thumbnail: string, size: ThumbnailSize = ThumbnailSize.Original) {
  const url = `${config.get('/url/base')}images/${size}${thumbnail}.jpg`
  return url
}
