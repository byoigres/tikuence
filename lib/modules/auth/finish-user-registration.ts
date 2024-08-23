import { RouteOptions, RouteOptionsValidate, Lifecycle } from '@hapi/hapi';
import Joi from 'joi';
import { getJoiMessages } from "../../server/failAction"
import { verifyToken } from "./complete-profile"

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

const validate: RouteOptionsValidate = {
  payload: Joi.object({
    token: Joi.string().uuid().required().label("token").messages(getMessages("token")),
    name: Joi.string().required().label("name").messages(getMessages("name")),
    username: Joi.string().required().label("username").messages(getMessages("username")),
    bio: Joi.string().allow('').optional().label("bio"),
    tiktokUsername: Joi.string().allow('').optional().label("tiktok-username"),
    terms: Joi.boolean().valid(true).required().label("terms").messages(getMessages("terms")),
  }),
};

const handler: Lifecycle.Method = async (request, h) => {
  if (request.auth.isAuthenticated) {
    return h.redirect("/");
  }

  const { token } = request.payload as Payload;

  // TODO: Implement the logic to complete the user registration

  return h.redirect(`/auth/complete-profile?token=${token}`);
}

const finishUserRegistration: RouteOptions = {
  validate,
  pre: [verifyToken],
  handler,
};

export default finishUserRegistration;
