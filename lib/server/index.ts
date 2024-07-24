import { Server } from "@hapi/hapi";
import Glue, { Manifest } from "@hapi/glue";
import Handlebars from "handlebars";
import Vision from "@hapi/vision";
import inertia from "hapi-inertia";
import root from "../modules/root";

const options = {
    relativeTo: __dirname
}

const manifest: Manifest = {
    server: {
        port: 8000
    },
register: {
    plugins: [
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
            plugin: root
        }
    ]
}
}

const startServer = async function () {
    try {
        const server = await Glue.compose(manifest, options);

        server.views({
            engines: { html: Handlebars },
            relativeTo: __dirname,
            path: "../templates"
        });

        Handlebars.registerHelper('json', function (context) {
            return JSON.stringify(context);
        });

        await server.start();
        console.log('hapi days!');
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();
