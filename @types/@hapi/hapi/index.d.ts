import "@hapi/hapi";
import { Model } from 'sequelize';
import PendingUser from "lib/models/pending_users";
import SocialProviders from "lib/models/social_providers";

declare module "@hapi/hapi" {
  interface Server {
    models: {
      PendingUsers: typeof PendingUser;
      SocialProviders: typeof SocialProviders;
    };
  }

  interface ServerApplicationState {
    appName: string;
  }
}
