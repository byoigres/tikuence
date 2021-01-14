import { Express} from 'express'
import Passport from 'passport'
// import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as TwitterStrategy } from 'passport-twitter'

Passport.use(
  new TwitterStrategy(
    {
      consumerKey: '',
      consumerSecret: '',
      callbackURL: ''
    },
    function (token, tokenSecret, profile, done) {
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

Passport.deserializeUser(function (id : Express.User, done) {
  // User.findById(id, function (err, user) {
  //   done(err, user)
  // })
  // console.log('deserializeUser', id)
  done(undefined, id)
})

Passport.use(
  new GoogleStrategy(
    {
      clientID: '',
      clientSecret: '',
      callbackURL: ''
    },
    function (accessToken, refreshToken, profile, done) {
      // console.log('accessToken', accessToken)
      // console.log('refreshToken', refreshToken)
      // console.log('profile', profile)

      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user)
      // })
      done(undefined, profile)
    }
  )
)

export default Passport
