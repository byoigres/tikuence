import { Plugin, PluginNameVersion, Server } from "@hapi/hapi";
import addView from "./add-view";
import createList from "./create-list";
import viewList from "./view";

const lists: Plugin<PluginNameVersion> = {
  name: "tikuence/modules/list",
  version: "1.0.0",
  register: function (server: Server) {
    console.log("Inside 'tikuence/modules/list'");

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
      {
        method: "GET",
        path: "/{urlId}",
        options: viewList,
      },
    ]);
  }
};

export default lists;
