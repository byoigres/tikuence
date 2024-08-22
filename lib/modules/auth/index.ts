import {
  Plugin,
  PluginNameVersion,
  Server,
} from "@hapi/hapi";
import access from "./access";
import completeProfile from "./complete-profile";
import finishUserRegistration from "./finish-user-registration";
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
        path: "/signin",
        options: access,
      },
      {
        method: "GET",
        path: "/signup",
        options: access,
      },
      {
        method: "GET",
        path: "/logout",
        options: logout,
      },
      {
        method: "GET",
        path: "/complete-profile",
        options: completeProfile,
      },
      {
        method: "POST",
        path: "/complete-profile",
        options: finishUserRegistration,
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
