import { RouteOptions, RouteOptionsValidate, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
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

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  username: string;
  picture: string;
}

export interface VerifyUserExistPreResponse {
  user: UserProfile;
}

const getGoogleProviderId: RouteOptionsPreObject = {
  assign: "getGoogleProviderId",
  method: async (request, h) => {
    const { SocialProviders } = request.server.plugins.sequelize.models;

    const googleProvier = await SocialProviders.findOne({
      where: { name: SocialProvidersEnum.GOOGLE }
    });

    if (!googleProvier) {
      return h.response().code(500);
    }

    return googleProvier.id;
  },
};

const verifyUserExist: RouteOptionsPreObject = {
  assign: "verifyUserExist",
  method: async (request, h) => {
    if (!request.auth.isAuthenticated) {
      return `Authentication failed due to: ${request.auth.error.message}`;
    }

    const googleProviderId = request.pre.getGoogleProviderId as number;

    const { Users, UsersSocialProviders } = request.server.plugins.sequelize.models;

    const googleProfile = request.auth.credentials.profile as GoogleProfile;

    const user = await Users.findOne({
      attributes: ['id', 'name', 'email', 'username', 'profile_picture_url'],
      where: {
        email: googleProfile.email
      },
      include: [
        {
          model: UsersSocialProviders,
          where: {
            profile_id: googleProfile.id,
            provider_id: googleProviderId
          }
        }
      ]
    });

    if (user) {
      const userProfile: UserProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        picture: user.profile_picture_url,
      };
      request.cookieAuth.set(userProfile);
      request.yar.flash("success", "Successfully logged in");
      return h.redirect("/").takeover();
    }

    return googleProfile;
  },
};

const handler: Lifecycle.Method = async (request, h) => {
  const { PendingUsers } = request.server.plugins.sequelize.models;
  const googleProfile = request.pre.verifyUserExist as GoogleProfile;
  const googleProviderId = request.pre.getGoogleProviderId as number;

  const expires_at = new Date();
  // Expires in 24 hours
  expires_at.setTime(expires_at.getTime() + 86400000);

  await PendingUsers.destroy({
    where: {
      email: googleProfile.email,
      provider_id: googleProviderId,
      profile_id: googleProfile.id
    }
  });

  const pendingUser = await PendingUsers.create({
    email: googleProfile.email,
    name: googleProfile.displayName,
    provider_id: googleProviderId,
    profile_id: googleProfile.id,
    expires_at,
    token: uuidv4(),
    profile_picture_url: googleProfile.raw.picture,
  });

  return h.redirect(`/auth/complete-profile?token=${pendingUser.token}`);
};

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
  pre: [
    getGoogleProviderId,
    verifyUserExist,
  ],
  handler,
};

export default google;
