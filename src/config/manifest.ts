const manifest = {
  app: {
    host: {
      $env: 'APP_HOST'
    },
    port: {
      $env: 'APP_PORT',
      $coerce: 'number'
    }
  },
  db: {
    url: {
      $env: 'DATABASE_URL'
    },
    appName: {
      $env: 'DATABASE_APP_NAME'
    },
    pool: {
      min: {
        $env: 'DATABASE_POOL_MIN',
        $coerce: 'number'
      },
      max: {
        $env: 'DATABASE_POOL_MAX',
        $coerce: 'number'
      }
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
  session: {
    name: {
      $env: 'SESION_COOKIE_NAME'
    },
    secret: {
      $env: 'SESION_COOKIE_SECRET'
    },
    resave: {
      $env: 'SESION_COOKIE_RESAVE'
    },
    saveUninitialized: {
      $env: 'SESION_COOKIE_SAVE_UNINITIALIZED'
    },
    secure: {
      $env: 'SESION_COOKIE_SECURE'
    },
    maxAge: {
      $env: 'SESION_COOKIE_MAX_AGE',
      $coerce: 'number'
    }
  },
  url: {
    salt: {
      $env: 'URL_HASH_SALT'
    },
    minLength: {
      $env: 'URL_HASH_MIN_LENGTH',
      $coerce: 'number'
    },
    alphabet: {
      $env: 'URL_HASH_ALPHABET'
    },
    modifiers: {
      lists: {
        $env: 'URL_HASH_LIST_SALT',
        $coerce: 'number'
      },
      videos: {
        $env: 'URL_HASH_VIDEO_SALT',
        $coerce: 'number'
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
