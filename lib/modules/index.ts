import { Server } from "@hapi/hapi";
import { PluginObject } from "@hapi/glue";
import PublicOptions from "./public";
import FeedOptions from "./feed";
import AuthRoutes from "./auth";
import ListsRoutes from "./lists";

const Modules: PluginObject = {
  plugin: {
    name: "modules",
    version: "1.0.0",
    register: function (server: Server) {

      server.route([
        {
          method: "GET",
          path: "/{param*}",
          options: PublicOptions,
        },
        {
          method: "GET",
          path: "/",
          options: FeedOptions,
        },
        ...AuthRoutes,
        ...ListsRoutes,
      ]);

    },
  },
};

export default Modules;
