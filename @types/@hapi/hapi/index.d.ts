import "@hapi/hapi";

declare module "@hapi/hapi" {
  interface ServerApplicationState {
    appName: string;
  }
}
