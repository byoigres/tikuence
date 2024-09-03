import { Plugin, PluginNameVersion, Server } from "@hapi/hapi";
import addView from "./add-view";

const lists: Plugin<PluginNameVersion> = {
  name: "tikuence/modules/lists",
  version: "1.0.0",
  register: function (server: Server) {
    console.log("Inside 'tikuence/modules/lists'");

    server.route({
      method: "GET",
      path: "/add",
      options: addView,
    });
  }
};

  export default lists;
