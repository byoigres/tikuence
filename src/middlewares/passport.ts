import { Express } from 'express'
import Passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Strategy as LocalStrategy } from 'passport-local'
import UsersSocialProviders from '../models/userssocialproviders.model'
import SocialProviders from '../models/socialproviders.model'
import User from '../models/user.model'

import config from '../config'

// interface iEmail { value: String, verified: Boolean }

Passport.use(
  new TwitterStrategy(
    {
      consumerKey: config.get('/passport/providers/twitter/consumerKey'),
      consumerSecret: config.get('/passport/providers/twitter/consumerSecret'),
      callbackURL: config.get('/passport/providers/twitter/callbackURL')
    },
    async function verify(token, tokenSecret, profile, done) {
      const relation = await UsersSocialProviders.findOne({
        where: {
          identifier: profile.id
        }
      })

      if (!relation) {
        // User.create({
        //   email: '',
        //   hash: ''
        // })
      }

      console.log(relation)

      // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      //   return cb(err, user)
      // })

      // console.log('twitter')
      // console.log('token', token)
      // console.log('refreshToken', tokenSecret)
      // console.log('profile', profile)

      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user)
      // })
      done(undefined, profile)
    }
  )
)

Passport.serializeUser(function (user, done) {
  // console.log('serializeUser', user)
  done(null, user)
  // if you use Model.id as your idAttribute maybe you'd want
  // done(null, user.id);
})

Passport.deserializeUser(function (id: Express.User, done) {
  // User.findById(id, function (err, user) {
  //   done(err, user)
  // })
  // console.log('deserializeUser', id)
  done(undefined, id)
})

Passport.use(
  new GoogleStrategy(
    {
      clientID: config.get('/passport/providers/google/clientID'),
      clientSecret: config.get('/passport/providers/google/clientSecret'),
      callbackURL: config.get('/passport/providers/google/callbackURL')
    },
    async function verify(accessToken, refreshToken, profile, done) {
      // console.log('accessToken', accessToken)
      // console.log('refreshToken', refreshToken)
      // console.log('profile', profile)

      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user)
      // })
      if (profile.emails && profile.emails.length > 0) {
        const {
          emails: {
            0: { value: email }
          }
        } = profile // profile.emails[0].value
        let user = await User.findOne({
          attributes: ['id', 'email'],
          where: {
            email
          },
          include: [
            {
              model: SocialProviders,
              through: {
                where: {
                  identifier: profile.id,
                  provider_id: 1
                }
              }
            }
          ]
        })

        if (!user) {
          user = await User.create(
            {
              email,
              hash: ''
            }
          )

          await UsersSocialProviders.create({
            user_id: user.id,
            provider_id: 1, // GOOGLE
            identifier: profile.id
          })
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
