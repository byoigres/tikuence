import { Express } from 'express'
import Passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Strategy as LocalStrategy } from 'passport-local'
import Knex, { Tables, iSocialProviderUser } from '../utils/knex'
import config from '../config'

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
  done(null, user)
})

Passport.deserializeUser(function (id: Express.User, done) {
  done(undefined, id)
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
            'USP.provider_id': 1
          })
          .first()

        if (!user) {
          const transaction = await knex.transaction()

          try {
            const userId = await knex(Tables.Users).transacting(transaction).insert({
              email,
              hash: '',
              created_at: new Date(),
              updated_at: new Date()
            }).returning('id')

            await knex(`${Tables.UsersSocialProviders} AS USP`).transacting(transaction).insert({
              user_id: userId,
              provider_id: 1,
              identifier: profile.id
            })

            await transaction.commit()
          } catch (err) {
            await transaction.rollback()

            return done(err)
          }
        }

        done(undefined, {
          id: user.id,
          email: user.email,
          provider: {
            google: profile.id
          }
        })
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
