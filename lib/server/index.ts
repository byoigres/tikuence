import { Server } from "@hapi/hapi";
import Glue, { Manifest } from "@hapi/glue";
import Path from 'path';
import Handlebars from "handlebars";
import Vision from "@hapi/vision";
import Inert from "@hapi/inert";
// import inertia from "hapi-inertia";
import inertia from "../../../../@byoigres/hapi-inertia/lib/index.js";

const options = {
    relativeTo: __dirname
}

const manifest: Manifest = {
    server: {
        port: 8000,
        routes: {
            files: {
                relativeTo: Path.join(__dirname, "..", "..", 'public')
            }
        }
    },
    register: {
        plugins: [
            Inert,
            Vision,
            {
                plugin: inertia.plugin,
                options: {
                    defaultTemplate: "index",
                    sharedProps: (_server: Server) => ({
                        appName: "Tikuence"
                    })
                }
            },
            {
                plugin: "../modules/public"
            },
            {
                plugin: "../modules/root"
            }
        ]
    }
}

const startServer = async function () {
    try {
        const server = await Glue.compose(manifest, options);

        server.views({
            engines: { hbs: Handlebars },
            relativeTo: __dirname,
            path: "../templates"
        });

        Handlebars.registerHelper('json', function (context) {
            return JSON.stringify(context);
        });

        await server.start();
        console.log(`Tikuence running at ${server.info.uri}`);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();
