import { RouteOptions, RouteOptionsPreObject } from '@hapi/hapi';
import Joi from 'joi';
import { getJoiMessages } from "../../server/failAction"

type Payload = {
  token: string;
  name: string;
  username: string;
  bio: string;
  tiktokUsername: string;
}

const getMessages = getJoiMessages([
  {
    name: "token",
    messages: [],
  },
  {
    name: "name",
    messages: [
      {
        types: ["any.required", "string.empty", "alternatives.match"],
        message: "You must provide a name",
      },
    ],
  },
  {
    name: "username",
    messages: [
      {
        types: ["any.required", "string.empty", "alternatives.match"],
        message: "You must provide a username",
      },
    ],
  },
  {
    name: "terms",
    messages: [
      {
        types: ["any.only"],
        message: "You must agree to the terms and conditions",
      }
    ],
  },
]);

const component = 'Auth/CompleteProfile';

export const verifyToken: RouteOptionsPreObject = {
  assign: "verifyToken",
  method: async (request, h) => {
    const { token } = request.payload as Payload;

    const { PendingUsers } = request.server.plugins["plugins/sequelize"].models;

    const user = await PendingUsers.findOne({
      where: {
        token,
      },
    });

    if (!user) {
      request.yar.flash("error", "The provided token was invalid");
      return h.redirect(`/auth/singup`).takeover();
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

const finishUserRegistration: RouteOptions = {
  validate: {
    payload: Joi.object({
      token: Joi.string().uuid().required().label("token").messages(getMessages("token")),
      name: Joi.string().required().label("name").messages(getMessages("name")),
      username: Joi.string().required().label("username").messages(getMessages("username")),
      bio: Joi.string().allow('').optional().label("bio"),
      tiktokUsername: Joi.string().allow('').optional().label("tiktok-username"),
      terms: Joi.boolean().valid(true).required().label("terms").messages(getMessages("terms")),
    }),
  },
  pre: [verifyToken],
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      return h.redirect("/");
    }

    const { token } = request.payload as Payload;

    // const { PendingUsers } = request.server.plugins["plugins/sequelize"].models;

    // const user = await PendingUsers.findOne({
    //   where: { token },
    // });

    // if (!user) {
    //   request.yar.flash("error", "Invalid token");
    // }

    // TODO: Implement the logic to complete the user registration

    return h.redirect(`/auth/complete-profile?token=${token}`);
  },
};

export default finishUserRegistration;
