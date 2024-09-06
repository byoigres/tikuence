import { RouteOptions, RouteOptionsValidate, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import Joi from 'joi';
import { getJoiMessages } from "../../server/messages"
import { QueryParams, verifyToken, VerifyTokenPreResponse } from "./complete-profile"
import { UserProfile } from "./google"

type Payload = {
  name: string;
  username: string;
  bio: string;
  tiktokUsername: string;
}

type CreateUserPreResponse = {
  user_id: number;
  name: string;
  email: string;
  username: string;
  picture: string;
}

const getMessages = getJoiMessages("finish-user-registration");

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

    const { Users } = request.server.plugins.sequelize.models;

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

const createUser: RouteOptionsPreObject = {
  assign: "createUser",
  method: async (request, _h) => {
    const { name, username, bio, tiktokUsername } = request.payload as Payload;
    const { email, profilePictureURL, providerId, profileId } = request.pre.verifyToken as VerifyTokenPreResponse;

    const {
      models: {
        Users,
        UsersSocialProviders,
        PendingUsers,
      },
      sequelize
    } = request.server.plugins.sequelize;

    const transaction = await sequelize.transaction();

    try {
      const user = await Users.create({
        name,
        username,
        email,
        biography: bio,
        tiktok_username: tiktokUsername,
        hash: "",
        profile_picture_url: profilePictureURL,
      }, {
        transaction,
        returning: true
      });

      await UsersSocialProviders.create({
        user_id: user.id,
        provider_id: providerId,
        profile_id: profileId,
        data: {},
      }, {
        transaction,
      });

      await PendingUsers.destroy({
        where: {
          email,
          provider_id: providerId,
          profile_id: profileId,
        },
        transaction,
      });

      await transaction.commit();

      return {
        user_id: user.id,
        name,
        email,
        username,
        picture: profilePictureURL,
      };
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  },
};

const handler: Lifecycle.Method = async (request, h) => {
  if (request.auth.isAuthenticated) {
    return h.redirect("/");
  }

  const { user_id, name, email, username, picture } = request.pre.createUser as CreateUserPreResponse;

  const profile: UserProfile = {
    id: user_id,
    name,
    email,
    username,
    picture,
  };

  request.cookieAuth.set(profile);
  request.yar.flash("success", "Successfully registered");

  return h.redirect("/");
}

const finishUserRegistration: RouteOptions = {
  validate,
  pre: [
    verifyToken,
    verifyUsernameAvailability,
    createUser,
  ],
  auth: {
    mode: "try",
    strategy: "session",
  },
  cors: {
    credentials: true,
    origin: ["*"],
    headers: ["WWW-Authenticate", "Server-Authorization"],
  },
  handler,
};

export default finishUserRegistration;
