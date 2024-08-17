import { Plugin, PluginNameVersion, Server } from "@hapi/hapi";

const root: Plugin<PluginNameVersion> = {
  name: "tikuence/modules/root",
  version: "1.0.0",
  register: function (server: Server) {
    console.log("Inside 'tikuence/modules/root'");

    server.route({
      method: "GET",
      path: "/",
      options: {
        auth: {
          mode: "try",
          strategy: "session",
        },
      },
      handler(_request, h) {
        return h.inertia(
          "Feed",
          {
            name: "Sergio",
            points: 1000,
          },
          {
            title: "Hey root!",
            message: "Welcome!",
            year: 2021,
          },
        );
      },
    });
  },
};

export default root;
