import "@hapi/hapi";
import { Store } from "confidence";
import { UrlIDType } from "lib/plugins/url-id"
// Sequelize models
import PendingUser from "lib/models/pending_users";
import SocialProviders from "lib/models/social_providers";
import Users from "lib/models/users";
import UsersSocialProviders from "lib/models/users_social_providers";
import Categories from "lib/models/categories";
import Languages from "lib/models/languages";
import Lists from "lib/models/lists";
import ListsCategories from "lib/models/lists_categories";
import ListsLanguages from "lib/models/lists_languages";
import { Sequelize } from "sequelize";

interface SequelizeModels {
  PendingUsers: typeof PendingUser;
  SocialProviders: typeof SocialProviders;
  Users: typeof Users;
  UsersSocialProviders: typeof UsersSocialProviders;
  Categories: typeof Categories;
  Languages: typeof Languages;
  Lists: typeof Lists;
  ListsCategories: typeof ListsCategories;
  ListsLanguages: typeof ListsLanguages;
}

interface ServerMethods {
  encodeUrlID: (type: UrlIDType, value: number) => string;
  decodeUrlID: (value: string) => number | null;
}

declare module "@hapi/hapi" {
  interface Server {
    models: SequelizeModels;
    methods: ServerMethods
  }

  interface PluginProperties {
    "plugins/sequelize": {
      models: SequelizeModels;
      sequelize: Sequelize
    };
    // methods: ServerMethods;
  }

  interface ServerApplicationState {
    appName: string;
    config: Store;
    // methods: ServerMethods;
  }
}
