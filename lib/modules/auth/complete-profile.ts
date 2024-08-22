import { RouteOptions, RouteOptionsPreObject } from '@hapi/hapi';
import Joi from 'joi';

const component = 'Auth/CompleteProfile';

export interface verifyTokenPreResponse {
  email: string;
  name: string;
  token: string;
}

export const verifyToken: RouteOptionsPreObject = {
  assign: "verifyToken",
  method: async (request, h) => {
    const { token } = request.query;

    const { PendingUsers } = request.server.plugins["plugins/sequelize"].models;

    const user = await PendingUsers.findOne({
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
      token,
    }
  },
};


const completeProfile: RouteOptions = {
  validate: {
    query: Joi.object({
      token: Joi.string().uuid().required(),
    }),
  },
  pre: [verifyToken],
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      return h.redirect("/");
    }

    const { email, name, token } = request.pre.verifyToken as verifyTokenPreResponse;

    return h.inertia(component, {
      email,
      name,
      token,
    }, {
      title: "Complete Profile",
    });
  },
};

export default completeProfile;
