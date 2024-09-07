import { Server } from "@hapi/hapi";
import Vision from "@hapi/vision";
import Inert from "@hapi/inert";
import Bell from "@hapi/bell";
import Cookie from "@hapi/cookie";
import Handlebars from "handlebars";
import Config from "./config";

export default async function preRegister(server: Server) {
  server.register(Cookie);
  server.register(Inert);
  server.register(Vision);
  server.register(Bell);

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
}
