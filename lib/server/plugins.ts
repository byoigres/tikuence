import { PluginObject } from "@hapi/glue";
import Yar from "@hapi/yar";
import inertia from "hapi-inertia";
import Store from "./store";
import UrlIDPlugin from "../plugins/url-id";
import sharedProps from "./inertia";
import SequelizePlugin from "../plugins/sequelize";
import PublicModule from "../modules/public";
import RootModule from "../modules/root";
import AuthModule from "../modules/auth";
import ListsModule from "../modules/lists";

const plugins: PluginObject[] = [
  {
    plugin: UrlIDPlugin,
    options: {
      lists: {
        alphabet: Store.get(`/security/urlid/lists/alphabet`) as string,
        minLength: Store.get(`/security/urlid/lists/minLength`) as number,
        salt: Store.get(`/security/urlid/lists/salt`) as number,
      }
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
  PublicModule,
  RootModule,
  {
    plugin: AuthModule,
    routes: {
      prefix: "/auth",
    },
  },
  {
    plugin: ListsModule,
    routes: {
      prefix: "/lists",
    },
  }
];


export default plugins;
