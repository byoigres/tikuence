import "@hapi/hapi";
import PendingUser from "lib/models/pending_users";
import SocialProviders from "lib/models/social_providers";
import Users from "lib/models/users";
import UsersSocialProviders from "lib/models/users_social_providers";
import Categories from "lib/models/categories";
import Languages from "lib/models/languages";
import Lists from "lib/models/lists";
import { Sequelize } from "sequelize";

interface SequelizeModels {
  PendingUsers: typeof PendingUser;
  SocialProviders: typeof SocialProviders;
  Users: typeof Users;
  UsersSocialProviders: typeof UsersSocialProviders;
  Categories: typeof Categories;
  Languages: typeof Languages;
  Lists: typeof Lists;
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
