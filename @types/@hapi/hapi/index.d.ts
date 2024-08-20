import "@hapi/hapi";
import { Model } from 'sequelize';
import PendingUser from "lib/models/pending_users";
import SocialProviders from "lib/models/social_providers";

interface SequelizeModels {
  PendingUsers: typeof PendingUser;
  SocialProviders: typeof SocialProviders;
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
