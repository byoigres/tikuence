import { Plugin, Server } from "@hapi/hapi";
import Sqids from "sqids";

export enum UrlIDType {
  LISTS = "lists",
};

type SquidConfig = {
  alphabet: string;
  minLength: number;
  salt: number;
};

export type UrlIDPluginOptions = {
  lists: SquidConfig;
};

const UrlIDPlugin: Plugin<UrlIDPluginOptions> = {
  name: "url-id",
  version: "1.0.0",
  register: async function (server: Server, options: UrlIDPluginOptions) {
    console.log("Inside 'plugins/url-id'");

    server.method("encodeUrlId", (type: UrlIDType, value: number) => {
      const sqids = new Sqids({
        alphabet: options[type].alphabet,
        minLength: options[type].minLength,
      });

      return sqids.encode([
        value,
        options[type].salt,
      ]);
    });
  },
};

export default UrlIDPlugin;
