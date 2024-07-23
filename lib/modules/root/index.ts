import { Plugin, PluginNameVersion, Server } from "@hapi/hapi";

const root: Plugin<PluginNameVersion> = {
    name: 'tikuence/modules/root',
    version: '1.0.0',
    register: function (server: Server) {
        console.log("Inside 'tikuence/modules/root'");

        server.route({
            method: "GET",
            path: "/",
            handler(request, h) {
                return h.inertia()
                return h.view("index", {
                    title: "Hello world",
                    message: "Welcome!"
                })
            }
        })
    }
};

export default root;
