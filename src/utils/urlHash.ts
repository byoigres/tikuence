import Hashids from 'hashids'
import config from '../config'

const hashids = new Hashids(config.get('/url/salt'), config.get('/url/minLength'), config.get('/url/alphabet'))

export const LIST_MODIFIER = config.get('/url/modifiers/lists')

export const VIDEO_MODIFIER = config.get('/url/modifiers/videos')

export default {
  encode: (value: number, modifier: number) => hashids.encode([value, modifier]),
  decode: (hash: string, modifier: number) => {
    const [value, modifierValue] = hashids.decode(hash)
    if (modifier === modifierValue) {
      return null
    }

    return value
  }
}
