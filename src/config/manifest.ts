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
    url: {
      $env: 'DATABASE_URL'
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
  },
  images: {
    path: {
      $env: 'IMAGES_PATH'
    }
  }
}

export default manifest
