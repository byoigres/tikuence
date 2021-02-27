import { Request } from 'express'
import Knex, { Tables } from '../../utils/knex'

async function response(req: Request) {
  const params = req.params
  const knex = Knex()

  const fields: string[] = ['id', 'name', 'username']

  if (req.isAuthenticated()) {
    fields.push('email')
  }

  const user = await knex(Tables.Users).select(...fields).where('username', params.username).first()
  const isMe = req.isAuthenticated() && req.params.username === req.user.username

  const lists = await knex(`${Tables.Lists} as L`)
    .select('L.id', 'L.title', 'VT.thumbnail_name as thumbnail', 'U.email', 'VT.total as total_videos')
    .joinRaw(
      `JOIN LATERAL (${knex
        .select(
          'V.id',
          'V.thumbnail_name',
          'V.created_at',
          knex(`${Tables.ListsVideos} AS ILV`).count('*').whereRaw('"ILV"."list_id" = "L"."id"').as('total')
        )
        .from(`${Tables.ListsVideos} AS LV`)
        .join(`${Tables.Videos} AS V`, 'LV.video_id', 'V.id')
        .whereRaw('"LV"."list_id" = "L"."id"')
        .orderBy('V.created_at', 'DESC')
        .limit(1)}) AS "VT" ON TRUE`
    )
    .join(`${Tables.Users} AS U`, 'L.user_id', 'U.id')
    .where('U.id', user.id)
    .orderBy('VT.created_at', 'DESC')
    .limit(12)
    .offset(0)

  req.Inertia.setViewData({ title: 'Profile' }).render({
    component: 'Profile/Profile',
    props: {
      user,
      isMe,
      lists,
      showModal: 'profile'
    }
  })
}

export default [response]
