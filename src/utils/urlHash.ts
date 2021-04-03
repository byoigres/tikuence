import Hashids from 'hashids'
import config from '../config'

const hashids = new Hashids(config.get('/url/salt'), config.get('/url/minLength'), config.get('/url/alphabet'))

export default hashids
