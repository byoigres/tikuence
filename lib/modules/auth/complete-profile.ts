import { RouteOptions, RouteOptionsValidate, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import Joi from 'joi';

const component = 'Auth/CompleteProfile';

export type QueryParams = {
  token: string;
}

export interface VerifyTokenPreResponse {
  email: string;
  name: string;
  profilePictureURL: string;
  providerId: number;
  profileId: string;
  token: string;
}

const validate: RouteOptionsValidate = {
  query: Joi.object({
    token: Joi.string().uuid().required(),
  }),
};

export const verifyToken: RouteOptionsPreObject = {
  assign: "verifyToken",
  method: async (request, h) => {
    const { token } = request.query as QueryParams;

    const { PendingUser } = request.server.plugins.sequelize.models;

    const user = await PendingUser.findOne({
      attributes: [
        "email",
        "name",
        "expires_at",
        "profile_picture_url",
        "social_provider_id",
        "profile_id"
      ],
      where: {
        token,
      },
    });

    if (!user) {
      return h.inertia(component, {
        isInvalid: true,
      }, {
        title: "Invalid Token",
      });
    }

    if (user.expires_at < new Date()) {
      return h.inertia(component, {
        isExpired: true,
      }, {
        title: "Complete Profile",
      });
    }

    return {
      email: user.email,
      name: user.name,
      profilePictureURL: user.profile_picture_url,
      providerId: user.social_provider_id,
      profileId: user.profile_id,
      token,
    }
  },
};

const handler: Lifecycle.Method = async (request, h) => {
  if (request.auth.isAuthenticated) {
    return h.redirect("/");
  }

  const { email, name, token } = request.pre.verifyToken as VerifyTokenPreResponse;

  return h.inertia(component, {
    email,
    name,
    token,
  }, {
    title: "Complete Profile",
  });
};

const completeProfile: RouteOptions = {
  validate,
  pre: [verifyToken],
  handler,
};

export default completeProfile;
