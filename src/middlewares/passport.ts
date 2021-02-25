import { Express } from 'express'
import Passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Strategy as LocalStrategy } from 'passport-local'
import { v4 as uuid } from 'uuid'
import Knex, { Tables, iSocialProviderUser } from '../utils/knex'
import config from '../config'

enum PROVIDERS {
  GOOGLE = 1
}

Passport.use(
  new TwitterStrategy(
    {
      consumerKey: config.get('/passport/providers/twitter/consumerKey'),
      consumerSecret: config.get('/passport/providers/twitter/consumerSecret'),
      callbackURL: config.get('/passport/providers/twitter/callbackURL')
    },
    async function verify(token, tokenSecret, profile, done) {
      done(undefined, profile)
    }
  )
)

Passport.serializeUser(function (user, done) {
  console.log('serializeUser', user)
  done(null, user)
})

Passport.deserializeUser(function (user: Express.User, done) {
  console.log('deserializeUser', user)
  done(undefined, user)
})

Passport.use(
  new GoogleStrategy(
    {
      clientID: config.get('/passport/providers/google/clientID'),
      clientSecret: config.get('/passport/providers/google/clientSecret'),
      callbackURL: config.get('/passport/providers/google/callbackURL')
    },
    async function verify(_accessToken, _refreshToken, profile, done) {
      if (profile.emails && profile.emails.length > 0) {
        const {
          emails: {
            0: { value: email }
          }
        } = profile
        const knex = Knex()

        const user = await knex<iSocialProviderUser>(`${Tables.Users} AS U`)
          .select('U.id', 'U.email')
          .where('U.email', email)
          .join(`${Tables.UsersSocialProviders} AS USP`, 'USP.user_id', 'U.id')
          .where({
            'USP.identifier': profile.id,
            'USP.provider_id': PROVIDERS.GOOGLE
          })
          .first()

        if (!user) {
          const expires_at = new Date()
          const token = uuid()
          expires_at.setTime(expires_at.getTime() + 900000)

          await knex(Tables.PendingUsers)
            .where('email', email)
            .del()

          await knex(Tables.PendingUsers).insert({
            email,
            expires_at,
            token
          })

          done(undefined, {
            pendingRegistrationToken: token,
            id: 0,
            email,
            provider: {}
          })

          // let pendingUser = await knex(Tables.PendingUsers)
          //   .select('expires_at')
          //   .where('email', email)
          //   .first<{ expires_at: Date }>()

          // if (pendingUser) {
          //   const expires_at = new Date()
          //   expires_at.setTime(expires_at.getTime() + 900000)
          //   pendingUser = await knex(Tables.PendingUsers)
          //     .update({ expires_at })
          //     .where('email', email)
          //     .returning<{ expires_at: Date }>('expires_at')
          // }

          // const transaction = await knex.transaction()

          // try {
          //   const [userId] = await knex(Tables.Users).transacting(transaction).insert({
          //     email,
          //     hash: '',
          //     created_at: new Date(),
          //     updated_at: new Date()
          //   }).returning('id')

          //   await knex(`${Tables.UsersSocialProviders} AS USP`).transacting(transaction).insert({
          //     user_id: userId,
          //     provider_id: PROVIDERS.GOOGLE,
          //     identifier: profile.id
          //   })

          //   await transaction.commit()

          //   done(undefined, {
          //     isRegistered: true,
          //     id: user.id,
          //     email: user.email,
          //     provider: {
          //       google: profile.id
          //     }
          //   })
          // } catch (err) {
          //   await transaction.rollback()

          //   return done(err)
          // }
        } else {
          done(undefined, {
            pendingRegistrationToken: undefined,
            id: user.id,
            email: user.email,
            provider: {
              google: profile.id
            }
          })
        }
      }
    }
  )
)

Passport.use(
  new LocalStrategy(function (username, password, done) {
    return done(null, { username, password })
  })
)

export default Passport
