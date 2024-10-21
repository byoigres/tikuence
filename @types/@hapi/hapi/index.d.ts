import "@hapi/hapi";
import { UrlIDType } from "lib/plugins/url-id"
// Sequelize models
import PendingUser from "lib/models/pending_user";
import SocialProvider from "lib/models/social_provider";
import User from "lib/models/user";
import UserSocialProvider from "lib/models/user_social_provider";
import Category from "lib/models/category";
import Language from "lib/models/language";
import List from "lib/models/list";
import ListCategory from "lib/models/list_category";
import ListLanguage from "lib/models/list_language";
import Author from "lib/models/author";
import Video from "lib/models/video";
import ListVideo from "lib/models/list_video";
import Hashtag from "lib/models/hashtag";
import ListHashtag from "lib/models/list_hashtag";
import { Sequelize } from "sequelize";
import { ThumbnailSize } from "lib/plugins/firebase";

interface SequelizeModels {
  PendingUser: typeof PendingUser;
  SocialProvider: typeof SocialProvider;
  User: typeof User;
  UserSocialProvider: typeof UserSocialProvider;
  Category: typeof Category;
  Language: typeof Language;
  List: typeof List;
  ListCategory: typeof ListCategory;
  ListLanguage: typeof ListLanguage;
  Author: typeof Author;
  Video: typeof Video;
  ListVideo: typeof ListVideo;
  Hashtag: typeof Hashtag;
  ListHashtag: typeof ListHashtag;
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
    "Firebase": {
      generateThumbnailNames: (imageHash: string) => Record<ThumbnailSize, string>;
      uploadThumbnails: (url: string, video_url_uid: string, imageHash: string) => Promise<void>;
    };

    "Sharp": {
      generateThumbnailNames: (imageHash: string) => Record<ThumbnailSize, string>;
    };
  }

  interface ServerApplicationState {
    appName: string;
  }
}
