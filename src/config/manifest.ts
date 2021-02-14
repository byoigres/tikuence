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
  firebase: {
    cert: {
      projectId: {
        $env: 'FIREBASE_CERT_PROJECT_ID'
      },
      privateKey: {
        $env: 'FIREBASE_CERT_PRIVATE_KEY'
      },
      clientEmail: {
        $env: 'FIREBASE_CERT_CLIENT_EMAIL'
      }
    },
    bucketUrl: {
      $env: 'FIREBASE_STORAGE_BUCKET_URL'
    },
    bucketFolder: {
      $env: 'FIREBASE_STORAGE_BUCKET_FOLDER'
    }
  },
  images: {
    path: {
      $env: 'IMAGES_PATH'
    }
  }
}

export default manifest
