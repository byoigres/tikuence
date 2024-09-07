import { Server } from "@hapi/hapi";
import { PluginObject } from "@hapi/glue";

const PublicModule: PluginObject = {
  plugin: {
    name: "modules/public",
    version: "1.0.0",
    register: function (server: Server) {

      server.route({
        method: "GET",
        path: "/{param*}",
        handler: {
          directory: {
            path: ".",
            redirectToSlash: true,
          },
        },
      });
    },
  },
};

export default PublicModule;
