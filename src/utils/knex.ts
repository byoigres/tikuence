import Knex, { PgConnectionConfig } from 'knex'
import Pg from 'pg'
import config from '../config'

Pg.types.setTypeParser(Pg.types.builtins.INT8, parseInt)
Pg.types.setTypeParser(Pg.types.builtins.FLOAT8, parseFloat)
Pg.types.setTypeParser(Pg.types.builtins.NUMERIC, parseFloat)

const knexOptions = {
  connection: <PgConnectionConfig>{
    connectionString: config.get('/db/url'),
    ssl:
      process.env.NODE_ENV === 'production'
        ? {
            require: process.env.NODE_ENV === 'production',
            rejectUnauthorized: false // <<<<<<< YOU NEED THIS
          }
        : false,
    application_name: config.get('/db/appName')
  },
  dialect: 'postgres',
  client: 'pg',
  version: '13.1',
  debug: true,
  pool: { min: 0, max: 7 }
}

const knex = Knex(knexOptions)

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
  UsersFavorites = 'public.users_favorites',
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
