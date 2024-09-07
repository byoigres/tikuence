import { Server, Request } from "@hapi/hapi";
import Yar from "@hapi/yar";
import inertia from "hapi-inertia";
import Store from "./store";
import UrlIDPlugin from "../plugins/url-id";
import SequelizePlugin from "../plugins/sequelize";
import PublicModule from "../modules/public";
import RootModule from "../modules/root";
import AuthModule from "../modules/auth";
import ListsModule from "../modules/lists";

export default [
  {
    plugin: UrlIDPlugin,
    options: {
      lists: {
        alphabet: Store.get(`/security/urlid/lists/alphabet`) as string,
        minLength: Store.get(`/security/urlid/lists/minLength`) as number,
        salt: Store.get(`/security/urlid/lists/salt`) as number,
      }
    },
  },
  {
    plugin: SequelizePlugin,
    options: {
      dialect: Store.get("/database/dialect"),
      database: Store.get("/database/database"),
      username: Store.get("/database/username"),
      password: Store.get("/database/password"),
      host: Store.get("/database/host"),
      port: Store.get("/database/port"),
    },
  },
  {
    plugin: Yar,
    options: {
      storeBlank: false,
      cookieOptions: {
        password: "password-should-be-32-characters",
        isSecure: false,
        isSameSite: false,
      },
    },
  },
  {
    plugin: inertia.plugin,
    options: {
      defaultTemplate: "index",
      sharedProps: (request: Request, server: Server) => {
        const [errors] = request.yar.flash("errors");
        const [error, success, warning, info] = [
          request.yar.flash("error")?.[0],
          request.yar.flash("success")?.[0],
          request.yar.flash("warning")?.[0],
          request.yar.flash("info")?.[0],
        ];
        return ({
          appName: request.server.app.appName,
          auth: {
            isAuthenticated: request.auth.isAuthenticated,
            // TODO: Not the best way to do this, but it works for now
            profile: request.auth.isAuthenticated
              ? request.auth.credentials
              : null,
          },
          errors: errors ?? {},
          flash: {
            error,
            success,
            warning,
            info,
          },
        });
      },
    },
  },
  {
    plugin: PublicModule,
  },
  {
    plugin: RootModule,
  },
  {
    plugin: AuthModule,
    routes: {
      prefix: "/auth",
    },
  },
  {
    plugin: ListsModule,
    routes: {
      prefix: "/lists",
    },
  }
];
