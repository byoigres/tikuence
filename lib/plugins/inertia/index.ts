import { Plugin, PluginNameVersion, Server, DecorationMethod, ResponseToolkit, ResponseObject } from "@hapi/hapi";

export interface ToolkitRenderMethod {
    (component: string, context: InertiaContext): ResponseObject;
}

interface Internals {
    inertia: ToolkitRenderMethod
}

const internals: Internals = {
    inertia: async function (component: string, context: InertiaContext) {

        // context = {
        //     props: {},
        //     headers: {},
        //     viewData: {},
        //     statusCode: 200
        // }

        const page: Page = {
            version: 1,
            component,
            props: {},
            url: this.request.url
        };

        const allProps = { ...context.props };

        let dataKeys = Object.keys(allProps);

        if (this.request.headers["x-inertia-partial-data"] &&
            this.request.headers["x-inertia-partial-component"] === component) {
            dataKeys = this.request.headers["x-inertia-partial-data"].split(",")
        }

        for (const key of dataKeys) {
            if (typeof allProps[key] === "function") {
                page.props[key] = await allProps[key]();
            } else {
                page.props[key] = allProps[key];
            }
        }

        if (this.request.headers["x-inertia"]) {

        } else {
            return this.view('index', context);
        }
    }
};

const root: Plugin<PluginNameVersion> = {
    name: 'tikuence/plugins/inertia',
    version: '1.0.0',
    dependencies: "@hapi/vision",
    register: function (server: Server) {
        console.log("Inside plugin")
        server.decorate("toolkit", "inertia", internals.inertia)
    }
};

interface InertiaContext {
    props: Record<string, any>;
}

interface Page {
    version: number;
    component: string;
    props: Record<string, any>;
    url: URL;
}

export default root;
