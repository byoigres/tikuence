import Glue, { Manifest } from "@hapi/glue";
import Handlebars from "handlebars";
import Vision from "@hapi/vision";
import inertia from "../plugins/inertia";
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
                plugin: inertia
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

        await server.start();
        console.log('hapi days!');
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();
