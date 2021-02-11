import { Store } from 'confidence'
import dotenv from 'dotenv'
import manifest from './manifest'
console.log('process.env:0', JSON.stringify(process.env))
dotenv.config()
console.log('process.env:1', JSON.stringify(process.env))

const store = new Store()

store.load(manifest)

export default store
