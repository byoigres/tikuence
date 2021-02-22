import { Pool } from 'pg'
import config from '../config'

const pool = new Pool({
  connectionString: config.get('/db/url'),
  min: config.get('/db/pool/min'),
  max: config.get('/db/pool/max'),
  application_name: config.get('/db/appName')
})

export default function Database() {
  return pool
}
