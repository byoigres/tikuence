import Knex from 'knex'
import config from '../config'

const knex = Knex({
  connection: config.get('/db/url'),
  dialect: 'postgres',
  client: 'pg',
  version: '13.1',
  debug: true,
  pool: { min: 0, max: 7 }
})

export default function Database() {
  return knex
}

export interface iFeedResult {
  id: number
  title: string
  email: string
  thumbnail: string
  // eslint-disable-next-line camelcase
  total_videos: number
}

export interface iProfileList {
  id: number
  title: string
  thumbnail?: string
  // eslint-disable-next-line camelcase
  total_videos?: number
}

export interface iProfileListVideos {
  id: number
  title: string
  thumbnail: string
  // eslint-disable-next-line camelcase
  order_id: number
}

export interface iSocialProviderUser {
  id: number
  email: string
}
