import { Store } from 'confidence'
import dotenv from 'dotenv'
import manifest from './manifest'

dotenv.config()

const store = new Store()

store.load(manifest)

export default store
