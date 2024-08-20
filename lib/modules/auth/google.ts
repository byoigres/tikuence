import { RouteOptions } from '@hapi/hapi';
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

const google: RouteOptions = {
  auth: {
    mode: "try",
    strategy: "google",
  },
  cors: {
    credentials: true,
    origin: ["*"],
    headers: ["WWW-Authenticate", "Server-Authorization"],
  },
  handler: async (request, h) => {
    if (!request.auth.isAuthenticated) {
      return `Authentication failed due to: ${request.auth.error.message}`;
    }

    const { PendingUsers, SocialProviders } = request.server.plugins["plugins/sequelize"].models;

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
};

export default google;
