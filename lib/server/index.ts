import { Server, Request } from "@hapi/hapi";
import Path from "path";
import Handlebars from "handlebars";
import Vision from "@hapi/vision";
import Inert from "@hapi/inert";
import Bell from "@hapi/bell";
import Cookie from "@hapi/cookie";
import Yar from "@hapi/yar";
import inertia from "hapi-inertia";
import Config from "./config";
import SequelizePlugin from "../plugins/sequelize";
import PublicModule from "../modules/public";
import RootModule from "../modules/root";
import AuthModule, { UserProfile } from "../modules/auth";
import ListsModule from "../modules/lists";
import failAction from "./failAction";

const startServer = async function () {
  try {
    const server = new Server({
      host: Config.get("/server/host"),
      port: Config.get("/server/port"),
      debug: Config.get("/server/debug"),
      routes: {
        files: {
          relativeTo: Path.join(__dirname, "..", "..", "public"),
        },
        cors: true,
        validate: {
          options: {
            abortEarly: false,
          },
          failAction,
      },
    },
    });

    server.app.appName = "Tikuence";    

    await server.register({
      plugin: SequelizePlugin,
      options: {
        config: Config,
      },
    });
    await server.register(Inert);
    await server.register(Vision);
    await server.register(Bell);
    await server.register(Cookie);
    await server.register({
      plugin: Yar,
      options: {
        storeBlank: false,
        cookieOptions: {
          password: "password-should-be-32-characters",
          isSecure: false,
          isSameSite: false,
        },
      },
    });

    await server.register({
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
    });

    server.auth.strategy("google", "bell", {
      provider: "google",
      password: Config.get("/auth/providers/google/cookie_encryption_password"),
      clientId: Config.get("/auth/providers/google/clientId"),
      clientSecret: Config.get("/auth/providers/google/clientSecret"),
      isSecure: Config.get("/auth/providers/google/isSecure"),
    });

    server.auth.strategy("session", "cookie", {
      cookie: {
        name: "sid-example",
        password: "password-should-be-32-characters",
        isSecure: false,
        isSameSite: false,
        path: "/",
      },
      redirectTo: "/auth/signin",
    });

    server.views({
      engines: { hbs: Handlebars },
      relativeTo: __dirname,
      path: "../templates",
    });

    Handlebars.registerHelper("json", function (context) {
      return JSON.stringify(context);
    });

    await server.register(PublicModule);
    await server.register(RootModule);
    await server.register({
      plugin: AuthModule,
      routes: {
        prefix: "/auth",
      },
    });
    await server.register({
      plugin: ListsModule,
      routes: {
        prefix: "/lists",
      },
    });

    await server.start();
    console.log(`Tikuence running at ${server.info.uri}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
