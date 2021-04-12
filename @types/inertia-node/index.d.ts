declare module "inertia-node" {
  import * as express from "express";

  interface IRenderData {
    component: string;
    [key: string]: object | string;
  }

  interface IInertia {
    setViewData(viewData: ViewData): this;
    shareProps(sharedProps: object): this;
    setStatusCode(statusCode: number): this;
    setHeaders(headers: object): this;
    render(args: IRenderData): void;
    redirect(url: string): void;
  }

  interface ViewData {
    title: string;
    thumbnail?: string;
  }

  function Html(page: object, viewData: ViewData): string;

  function inertia(html: typeof Html, version?: string): express.RequestHandler;

  export { inertia as default, IInertia, ViewData };
}
