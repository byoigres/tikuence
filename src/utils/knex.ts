import Knex from 'knex'
import Pg from 'pg'
import config from '../config'

Pg.types.setTypeParser(Pg.types.builtins.INT8, parseInt)
Pg.types.setTypeParser(Pg.types.builtins.FLOAT8, parseFloat)
Pg.types.setTypeParser(Pg.types.builtins.NUMERIC, parseFloat)

const knex = Knex({
  connection: config.get('/db/url'),
  dialect: 'postgres',
  client: 'pg',
  version: '13.1',
  debug: false,
  pool: { min: 0, max: 7 }
})

export default function Database() {
  return knex
}

export enum Tables {
  Authors = 'public.authors',
  Lists = 'public.lists',
  ListsVideos = 'public.lists_videos',
  SocialProviders = 'public.social_providers',
  Users = 'public.users',
  UsersSocialProviders = 'public.users_social_providers',
  Videos = 'public.videos',
  PendingUsers = 'public.pending_users'
}

export interface iFeedResult {
  id: number
  title: string
  email: string
  thumbnail: string
  // eslint-disable-next-line camelcase
  total_videos: number
}

// Details
export interface iDetailsItem {
  id: number
  title: string
  // eslint-disable-next-line camelcase
  user_id: number
}

// Lists-Videos
export interface iListVideo {
  id: number
  // eslint-disable-next-line camelcase
  order_id: string
}

// Video
export interface iVideo {
  id: number
  title: string
  html: string
}

// Profile
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
  username: string
  name: string
}
