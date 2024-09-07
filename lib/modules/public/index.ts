import { Plugin, PluginNameVersion, Server } from "@hapi/hapi";

const PublicModule: Plugin<PluginNameVersion> = {
  name: "tikuence/modules/public",
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
};

export default PublicModule;
