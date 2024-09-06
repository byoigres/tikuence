import { Plugin, PluginNameVersion, Server } from "@hapi/hapi";
import addView from "./add-view";
import createList from "./create-list";

const lists: Plugin<PluginNameVersion> = {
  name: "tikuence/modules/lists",
  version: "1.0.0",
  register: function (server: Server) {
    console.log("Inside 'tikuence/modules/lists'");

    server.route([
      {
        method: "GET",
        path: "/add",
        options: addView,
      },
      {
        method: "POST",
        path: "/",
        options: createList,
      },
      // {
      //   method: "GET",
      //   path: "/{urlId}",
      // },
    ]);
  }
};

export default lists;
