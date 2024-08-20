import {
  Plugin,
  PluginNameVersion,
  Server,
  Request,
  ResponseToolkit,
} from "@hapi/hapi";
import { v4 as uuidv4 } from "uuid";
import { SocialProvidersEnum } from "../../models/social_providers";

export interface GoogleProfile {
  id: string;
  displayName: string;
  name: {
    given_name: string;
    family_name: string;
  };
  email: string;
  raw: any;
}

const root: Plugin<PluginNameVersion> = {
  name: "tikuence/modules/auth",
  version: "1.0.0",
  register: function (server: Server) {
    console.log("Inside 'tikuence/modules/auth'");

    server.route([
      {
        method: "GET",
        path: "/login",
        options: {
          auth: {
            mode: "try",
            strategy: "session",
          },
        },
        handler(request, h) {
          if (!request.auth.isAuthenticated) {
            h.redirect("/");
          }

          return h.inertia("Auth/Login",{
            isLogin: true
          },{
            title: "Login"
          });
        },
      },
      {
        method: "GET",
        path: "/register",
        options: {
          auth: {
            mode: "try",
            strategy: "session",
          },
        },
        handler(request, h) {
          if (!request.auth.isAuthenticated) {
            h.redirect("/");
          }

          return h.inertia("Auth/Login", {
            isLogin: false
          }, {
            title: "Register"
          });
        },
      },
      {
        method: "GET",
        path: "/logout",
        options: {
          auth: {
            mode: "required",
            strategy: "session",
          },
        },
        handler(request, h) {
          request.cookieAuth.clear();
          return h.redirect("/");
        },
      },
      {
        method: ["GET", "POST"],
        path: "/google",
        options: {
          auth: {
            mode: "try",
            strategy: "google",
          },
          cors: {
            credentials: true,
            origin: ["*"],
            headers: ["WWW-Authenticate", "Server-Authorization"],
          },
        },
        handler: async (request: Request, h: ResponseToolkit) => {
          if (!request.auth.isAuthenticated) {
            return `Authentication failed due to: ${request.auth.error.message}`;
          }

          const { PendingUsers, SocialProviders } = request.server.models;

          const googleProvider = await SocialProviders.findOne({
            where: { name: SocialProvidersEnum.GOOGLE }
          });

          if (!googleProvider) {
            return h.response().code(500);
          }

          const profile = request.auth.credentials.profile as GoogleProfile;

          const expires_at = new Date()
          expires_at.setTime(expires_at.getTime() + 900000)

          await PendingUsers.findOrCreate({
            where: {
              email: profile.email,
              provider_id: 1,
              profile_id: profile.id
            },
            defaults: {
              email: profile.email,
              name: profile.displayName,
              provider_id: googleProvider.id,
              profile_id: profile.id,
              expires_at,
              token: uuidv4(),
              profile_picture_url: profile.raw.picture,
            },
          });

          request.cookieAuth.set("profile", {
            displayName: profile.displayName,
            email: profile.email,
          });

          // Perform any account lookup or registration, setup local session,
          // and redirect to the application. The third-party credentials are
          // stored in request.auth.credentials. Any query parameters from
          // the initial request are passed back via request.auth.credentials.query.

          return h.redirect("/");
        },
      },
    ]);
  },
};

export default root;
