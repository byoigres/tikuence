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

    const createSqids = (type: UrlIDType) => {
      return new Sqids({
        alphabet: options[type].alphabet,
        minLength: options[type].minLength,
      });
    };

    server.method("encodeUrlID", (type: UrlIDType, value: number): string => {
      return createSqids(type).encode([
        value,
        options[type].salt,
      ]);
    });

    server.method("decodeUrlID", (type: UrlIDType, value: string): number | null => {
      const [id, salt] = createSqids(type).decode(value);
      if (salt !== options[type].salt) {
        return null;
      }
      return id;
    });
  },
};

export default UrlIDPlugin;
