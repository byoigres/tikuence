import { Plugin, PluginNameVersion, Server } from "@hapi/hapi";

const root: Plugin<PluginNameVersion> = {
  name: "tikuence/modules/public",
  version: "1.0.0",
  register: function (server: Server) {
    console.log("Inside 'tikuence/modules/public'");

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

export default root;
