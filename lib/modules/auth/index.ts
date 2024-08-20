import {
  Plugin,
  PluginNameVersion,
  Server,
} from "@hapi/hapi";
import view from "./view";
import logout from "./logout";
import google from "./google";

export { GoogleProfile } from './google';

const auth: Plugin<PluginNameVersion> = {
  name: "modules/auth",
  version: "1.0.0",
  register: function (server: Server) {
    server.log(["debug", "modules", "modules/auth"], "Registering modules/auth module");

    server.route([
      {
        method: "GET",
        path: "/login",
        options: view,
      },
      {
        method: "GET",
        path: "/register",
        options: view,
      },
      {
        method: "GET",
        path: "/logout",
        options: logout,
      },
      {
        method: ["GET", "POST"],
        path: "/google",
        options: google,
      },
    ]);
  },
};

export default auth;
