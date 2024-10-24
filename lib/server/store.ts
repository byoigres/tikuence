import Confidence from "confidence";

const store = {
  server: {
    host: {
      $env: "APP_HOST",
      $default: "0.0.0.0",
    },
    port: {
      $env: "APP_PORT",
      $coerce: "number",
      $default: 8000,
    },
    debug: {
      $filter: {
        $env: "NODE_ENV",
      },
      $default: {
        log: ["info", "error", "implementation", "internal"],
        request: ["error", "implementation", "internal"],
      },
      production: {
        request: ["implementation"],
      },
    },
  },
  auth: {
    providers: {
      google: {
        cookie_encryption_password: {
          $env: "AUTH_BELL_GOOGLE_COOKIE_ENCRYPTION_PASSWORD",
        },
        clientId: {
          $env: "AUTH_BELL_GOOGLE_CLIENT_ID",
        },
        clientSecret: {
          $env: "AUTH_BELL_GOOGLE_CLIENT_SECRET",
        },
        callbackURL: {
          $env: "AUTH_BELL_GOOGLE_CALLBACK_URL",
        },
        isSecure: {
          $env: "AUTH_BELL_GOOGLE_IS_SECURE",
          $coerce: "boolean",
        },
      },
    },
  },
  session: {
    storeBlank: false,
    cookieOptions: {
      password: "password-should-be-32-characters",
      isSecure: false,
      isSameSite: false,
    },
  },
  database: {
    dialect: {
      $env: "DATABASE_DIALECT",
      $default: "postgres",
    },
    port: {
      $env: "DATABASE_PORT",
      $default: "sqlite",
    },
    database: {
      $env: "DATABASE_DB",
      $default: "tikuence",
    },
    username: {
      $env: "DATABASE_USER",
      $default: "tikuence",
    },
    password: {
      $env: "DATABASE_PASSWORD",
    },
  },
  security: {
    urlid: {
      lists: {
        alphabet: {
          $env: "SECURITY_URL_ID_LIST_ALPHABET",
        },
        minLength: {
          $env: "SECURITY_URL_ID_LIST_MIN_LENGTH",
          $coerce: "number",
        },
        salt: {
          $env: "SECURITY_URL_ID_LIST_SALT_NUMBER",
          $coerce: "number",
        },
      },
      videoThumbnails: {
        alphabet: {
          $env: "SECURITY_URL_ID_VIDEO_THUMBNAIL_ALPHABET",
        },
        minLength: {
          $env: "SECURITY_URL_ID_VIDEO_THUMBNAIL_MIN_LENGTH",
          $coerce: "number",
        },
        salt: {
          $env: "SECURITY_URL_ID_VIDEO_THUMBNAIL_SALT_NUMBER",
          $coerce: "number",
        },
      },
      video: {
        alphabet: {
          $env: "SECURITY_URL_ID_VIDEO_ALPHABET",
        },
        minLength: {
          $env: "SECURITY_URL_ID_VIDEO_MIN_LENGTH",
          $coerce: "number",
        },
        salt: {
          $env: "SECURITY_URL_ID_VIDEO_SALT_NUMBER",
          $coerce: "number",
        },
      },
    },
  },
  inertia: {
    defaultTemplate: "index",
  },
  firebase: {
    credential: {
      projectId: {
        $env: "FIREBASE_PROJECT_ID",
      },
      clientEmail: {
        $env: "FIREBASE_CLIENT_EMAIL",
      },
      privateKey: {
        $env: "FIREBASE_PRIVATE_KEY",
      },
    },
    bucketUrl: {
      $env: 'FIREBASE_STORAGE_BUCKET_URL'
    },
    thumbnailsFolder: {
      $env: 'FIREBASE_STORAGE_THUMBNAILS_FOLDER'
    }
  },
};

const document = new Confidence.Store(store);

export default document;
