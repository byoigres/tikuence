import "@hapi/hapi";
import PendingUser from "lib/models/pending_users";
import SocialProviders from "lib/models/social_providers";
import Users from "lib/models/users";

interface SequelizeModels {
  PendingUsers: typeof PendingUser;
  SocialProviders: typeof SocialProviders;
  Users: typeof Users;
}

declare module "@hapi/hapi" {
  interface Server {
    models: SequelizeModels;
  }

  interface PluginProperties {
    "plugins/sequelize": {
      models: SequelizeModels;
    };
  }

  interface ServerApplicationState {
    appName: string;
  }
}
