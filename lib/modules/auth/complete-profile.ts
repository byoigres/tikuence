import { RouteOptions } from '@hapi/hapi';
import Joi from 'joi';

const completeProfile: RouteOptions = {
  validate: {
    query: Joi.object({
      token: Joi.string().uuid().required(),
    }),
  },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      return h.redirect("/");
    }

    const component = 'Auth/CompleteProfile';

    const { token } = request.query;

    const { PendingUsers } = request.server.plugins["plugins/sequelize"].models;

    const pedingUser = await PendingUsers.findOne({
      where: {
        token,
      },
    });

    if (!pedingUser) {
      return h.inertia(component, {
        isInvalid: true,
      }, {
        title: "Invalid Token",
      });
    }

    if (pedingUser.expires_at > new Date()) {
      return h.inertia(component, {
        email: pedingUser.email,
        name: pedingUser.name,
        token,
      }, {
        title: "Complete Profile",
      });
    }

    return h.inertia(component, {
      isExpired: true,
    }, {
      title: "Complete Profile",
    });
  },
};

export default completeProfile;
