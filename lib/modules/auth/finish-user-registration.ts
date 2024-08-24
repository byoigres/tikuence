import { RouteOptions, RouteOptionsValidate, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import Joi from 'joi';
import { getJoiMessages } from "../../server/failAction"
import { QueryParams, verifyToken } from "./complete-profile"

type Payload = {
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

const validate: RouteOptionsValidate = {
  query: Joi.object({
    token: Joi.string().uuid().required().label("token").messages(getMessages("token")),
  }),
  payload: Joi.object({
    name: Joi.string().required().label("name").messages(getMessages("name")),
    username: Joi.string().required().label("username").messages(getMessages("username")),
    bio: Joi.string().allow('').optional().label("bio"),
    tiktokUsername: Joi.string().allow('').optional().label("tiktok-username"),
    terms: Joi.boolean().valid(true).required().label("terms").messages(getMessages("terms")),
  }),
};

const verifyUsernameAvailability: RouteOptionsPreObject = {
  assign: "verifyUsernameAvailability",
  method: async (request, h) => {
    const { username } = request.payload as Payload;

    const { Users } = request.server.plugins["plugins/sequelize"].models;

    const user = await Users.findOne({
      where: {
        username,
      },
    });

    if (user) {
      const { token } = request.query as QueryParams;

      request.yar.flash("errors", {
        username: "This username is already taken",
      });

      return h.redirect(`/auth/complete-profile?token=${token}`).takeover();
    }

    return h.continue;
  },
};

const handler: Lifecycle.Method = async (request, h) => {
  if (request.auth.isAuthenticated) {
    return h.redirect("/");
  }

  const { token } = request.query as QueryParams;

  // TODO: Implement the logic to complete the user registration

  

  return h.redirect(`/auth/complete-profile?token=${token}`);
}

const finishUserRegistration: RouteOptions = {
  validate,
  pre: [
    verifyToken,
    verifyUsernameAvailability,
  ],
  handler,
};

export default finishUserRegistration;
