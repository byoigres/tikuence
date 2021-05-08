import { Store } from 'confidence'
import manifest from './manifest'

const store = new Store()

store.load(manifest)

export default store
