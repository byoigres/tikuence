const manifest = {
  app: {
    host: {
      $env: 'APP_HOST'
    },
    port: {
      $env: 'APP_PORT'
    }
  },
  db: {
    host: {
      $env: 'DB_HOST'
    },
    port: {
      $env: 'DB_PORT'
    },
    database: {
      $env: 'DB_DATABASE'
    },
    username: {
      $env: 'DB_USERNAME'
    },
    password: {
      $env: 'DB_PASSWORD'
    },
    dialect: {
      $env: 'DB_DIALECT'
    }
  },
  passport: {
    providers: {
      google: {
        clientID: {
          $env: 'PASSPORT_GOOGLE_CLIENT_ID'
        },
        clientSecret: {
          $env: 'PASSPORT_GOOGLE_CLIENT_SECRET'
        },
        callbackURL: {
          $env: 'PASSPORT_GOOGLE_CALLBACK_URL'
        }
      },
      twitter: {
        consumerKey: {
          $env: 'PASSPORT_TWITTER_CONSUMER_KEY'
        },
        consumerSecret: {
          $env: 'PASSPORT_TWITTER_CONSUMER_SECRET'
        },
        callbackURL: {
          $env: 'PASSPORT_TWITTER_CALLBACK_URL'
        }
      }
    }
  }
}

export default manifest
