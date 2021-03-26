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
          },
          photos,
          name
        } = profile
        let picture = null

        if (photos && photos.length > 0) {
          picture = photos[0].value
        }

        const knex = Knex()

        const user = await knex<iSocialProviderUser>(`${Tables.Users} AS U`)
          .select('U.id', 'U.username', 'U.email', 'U.name')
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

          await knex(Tables.PendingUsers).where('email', email).del()

          await knex(Tables.PendingUsers).insert({
            email,
            name: name ? `${name.givenName} ${name.familyName}` : '',
            provider_id: PROVIDERS.GOOGLE,
            identifier: profile.id,
            expires_at,
            token
          })

          done(undefined, {
            pendingRegistrationToken: token,
            id: 0,
            email,
            username: '',
            name: '',
            picture,
            provider: {}
          })
        } else {
          done(undefined, {
            pendingRegistrationToken: undefined,
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            picture,
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
  new LocalStrategy(async function (email, _password, done) {
    const knex = Knex()

    const user = await knex<iSocialProviderUser>(`${Tables.Users} AS U`)
      .select('U.id', 'U.username', 'U.email', 'U.name')
      .where('U.email', email)
      .first()

    return done(undefined, {
      pendingRegistrationToken: undefined,
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      provider: {}
    })
  })
)

export default Passport
