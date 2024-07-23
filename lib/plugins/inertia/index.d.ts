import { ResponseObject } from "@hapi/hapi";

export interface ToolkitRenderMethod {
    (templatePath: string, context?: any): ResponseObject;
}

declare module '@hapi/hapi' {
    interface ResponseToolkit {
        inertia: ToolkitRenderMethod
    }
}