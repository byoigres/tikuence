import { Plugin, PluginNameVersion, Server } from "@hapi/hapi";

const root: Plugin<PluginNameVersion> = {
    name: 'tikuence/modules/root',
    version: '1.0.0',
    register: function (server: Server) {
        console.log("Inside 'tikuence/modules/root'");

        server.route({
            method: "GET",
            path: "/",
            handler(_request, h) {
                return h.inertia("index", {
                    name: "Sergio",
                    points: 1000
                }, {
                    title: "Hey root!",
                    message: "Welcome!",
                    year: 2021
                });

                // return h.view("index", {
                //     title: "Hello world",
                //     message: "Welcome!",
                //     page: {
                //         version: 1,
                //         component,
                //         props: props,
                //         url: this.request.url
                //     }
                // })
            }
        })
    }
};

export default root;
