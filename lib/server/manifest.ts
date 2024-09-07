import { Manifest } from "@hapi/glue";
import Path from "path";
import failAction from "./fail-action";
import Store from "./store";
import plugins from "./plugins";


const manifest: Manifest = {
  server: {
    host: Store.get("/server/host"),
    port: Store.get("/server/port"),
    debug: Store.get("/server/debug"),
    routes: {
      files: {
        relativeTo: Path.join(__dirname, "..", "..", "public"),
      },
      cors: true,
      validate: {
        options: {
          abortEarly: false,
        },
        failAction,
      },
    },
  },
  register: {
    plugins,
  },
};

export default manifest;
