import { PluginObject } from "@hapi/glue";
import Yar from "@hapi/yar";
import inertia from "hapi-inertia";
import Store from "./store";
import UrlIDPlugin from "../plugins/url-id";
import sharedProps from "./inertia";
import SequelizePlugin from "../plugins/sequelize";
import FirebasePlugin from "../plugins/firebase";
import Modules from "../modules";

const plugins: PluginObject[] = [
  {
    plugin: UrlIDPlugin,
    options: {
      lists: {
        alphabet: Store.get(`/security/urlid/lists/alphabet`) as string,
        minLength: Store.get(`/security/urlid/lists/minLength`) as number,
        salt: Store.get(`/security/urlid/lists/salt`) as number,
      },
      video_thumbnails: {
        alphabet: Store.get(`/security/urlid/videoThumbnails/alphabet`) as string,
        minLength: Store.get(`/security/urlid/videoThumbnails/minLength`) as number,
        salt: Store.get(`/security/urlid/videoThumbnails/salt`) as number,
      },
      video: {
        alphabet: Store.get(`/security/urlid/video/alphabet`) as string,
        minLength: Store.get(`/security/urlid/video/minLength`) as number,
        salt: Store.get(`/security/urlid/video/salt`) as number,
      },
    },
  },
  {
    plugin: FirebasePlugin,
    options: {
      projectId: Store.get("/firebase/credential/projectId"),
      clientEmail: Store.get("/firebase/credential/clientEmail"),
      privateKey: Store.get("/firebase/credential/privateKey"),
    },
  },
  {
    plugin: SequelizePlugin,
    options: {
      dialect: Store.get("/database/dialect"),
      database: Store.get("/database/database"),
      username: Store.get("/database/username"),
      password: Store.get("/database/password"),
      host: Store.get("/database/host"),
      port: Store.get("/database/port"),
    },
  },
  {
    plugin: Yar,
    options: {
      storeBlank: Store.get("/session/storeBlank"),
      cookieOptions: Store.get("/session/cookieOptions"),
    },
  },
  {
    plugin: inertia.plugin,
    options: {
      defaultTemplate: Store.get("/inertia/defaultTemplate"),
      sharedProps
    }
  },
  Modules,
];


export default plugins;
