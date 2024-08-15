import { Server, Request } from "@hapi/hapi";
import Path from 'path';
import Handlebars from "handlebars";
import Vision from "@hapi/vision";
import Inert from "@hapi/inert";
import Bell from "@hapi/bell";
import Cookie from "@hapi/cookie";
import inertia from "hapi-inertia";
import Config from './config';
import PublicModule from "../modules/public";
import RootModule from "../modules/root";
import AuthModule, { GoogleProfile } from "../modules/auth";

const startServer = async function () {
    try {
        const server = new Server({
            host: Config.get("/server/host"),
            port: Config.get("/server/port"),
            debug: Config.get("/server/debug"),
            routes: {
                files: {
                    relativeTo: Path.join(__dirname, "..", "..", 'public')
                },
                cors: true
            },
        });

        server.app.appName = "Tikuence";

        await server.register(Inert);
        await server.register(Vision);
        await server.register(Bell);
        await server.register(Cookie);
        await server.register({
            plugin: inertia.plugin,
            options: {
                defaultTemplate: "index",
                sharedProps: (request: Request, server: Server) => ({
                    appName: request.server.app.appName,
                    auth: {
                        isAuthenticated: request.auth.isAuthenticated,
                        profile: request.auth.isAuthenticated ? request.auth.credentials.profile as GoogleProfile : null
                    }
                })
            }
        });

        server.auth.strategy("google", "bell", {
            provider: "google",
            password: Config.get("/auth/providers/google/cookie_encryption_password"),
            clientId: Config.get("/auth/providers/google/clientId"),
            clientSecret: Config.get("/auth/providers/google/clientSecret"),
            isSecure: Config.get("/auth/providers/google/isSecure")
        });

        server.auth.strategy('session', 'cookie', {
            cookie: {
                name: "sid-example",
                password: 'password-should-be-32-characters',
                isSecure: false,
                isSameSite: false,
                path: "/"
            },
            redirectTo: '/auth/login',
        });

        server.views({
            engines: { hbs: Handlebars },
            relativeTo: __dirname,
            path: "../templates"
        });

        Handlebars.registerHelper('json', function (context) {
            return JSON.stringify(context);
        });

        await server.register(PublicModule);
        await server.register(RootModule);
        await server.register({
            plugin: AuthModule,
            routes: {
                prefix: '/auth'
            }
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
