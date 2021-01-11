import { IInertia } from "inertia-node";

declare global {
  namespace Express {
    export interface Request {
      auth: {
        isAuthenticated: boolean;
        credentials: object | null;
      };
      Inertia: IInertia;
      returnUrl: Function;
    }
  }
}
export {};