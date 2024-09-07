import Glue, { Options as GlueOptions } from "@hapi/glue";
import manifest from "./manifest";
import preRegister from "./pre-register";

const options: GlueOptions = {
  relativeTo: __dirname,
  preRegister,
};

const startServer = async function () {
  try {
    const server = await Glue.compose(manifest, options);
    await server.start();    
    server.log(["info"], `Tikuence running at ${server.info.uri}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
