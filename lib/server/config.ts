import Confidence from "confidence";

const config = {
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
  database: {
    port: {
      $env: "POSTGRES_PORT",
      $default: "sqlite",
    },
    database: {
      $env: "POSTGRES_DB",
      $default: "tikuence",
    },
    username: {
      $env: "POSTGRES_USER",
      $default: "tikuence",
    },
    password: {
      $env: "POSTGRES_PASSWORD",
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
    },
  },
};

const store = new Confidence.Store(config);

export default store;
