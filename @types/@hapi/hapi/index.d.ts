import "@hapi/hapi";
import { UrlIDType } from "lib/plugins/url-id"
// Sequelize models
import PendingUser from "lib/models/pending_user";
import SocialProvider from "lib/models/social_provider";
import Users from "lib/models/users";
import UsersSocialProvider from "lib/models/users_social_provider";
import Category from "lib/models/category";
import Language from "lib/models/language";
import List from "lib/models/list";
import ListCategory from "lib/models/list_category";
import ListLanguage from "lib/models/list_language";
import Author from "lib/models/author";
import Video from "lib/models/video";
import ListVideo from "lib/models/list_video";
import { Sequelize } from "sequelize";

interface SequelizeModels {
  PendingUser: typeof PendingUser;
  SocialProvider: typeof SocialProvider;
  Users: typeof Users;
  UsersSocialProvider: typeof UsersSocialProvider;
  Category: typeof Category;
  Language: typeof Language;
  List: typeof List;
  ListCategory: typeof ListCategory;
  ListLanguage: typeof ListLanguage;
  Author: typeof Author;
  Video: typeof Video;
  ListVideo: typeof ListVideo;
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
    "sequelize": {
      models: SequelizeModels;
      sequelize: Sequelize
    };
  }

  interface ServerApplicationState {
    appName: string;
  }
}
