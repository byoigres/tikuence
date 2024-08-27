import "@hapi/hapi";
import PendingUser from "lib/models/pending_users";
import SocialProviders from "lib/models/social_providers";
import Users from "lib/models/users";
import UsersSocialProviders from "lib/models/users_social_providers";
import { Sequelize } from "sequelize";

interface SequelizeModels {
  PendingUsers: typeof PendingUser;
  SocialProviders: typeof SocialProviders;
  Users: typeof Users;
  UsersSocialProviders: typeof UsersSocialProviders;
}

declare module "@hapi/hapi" {
  interface Server {
    models: SequelizeModels;
  }

  interface PluginProperties {
    "plugins/sequelize": {
      models: SequelizeModels;
      sequelize: Sequelize
    };
  }

  interface ServerApplicationState {
    appName: string;
  }
}
