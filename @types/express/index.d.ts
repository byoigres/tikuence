import { IInertia } from "inertia-node";

declare global {
  namespace Express {
    /**
     * @see https://stackoverflow.com/a/60981984/1301872
     */
    interface User {
      id: number;
      email: string;
      provider: {
        google?: string;
        twitter?: string;
        local?: string;
      }
    }
    export interface Request {
      auth: {
        isAuthenticated: boolean;
        credentials: object | null;
      };
      Inertia: IInertia;
    }
  }
}
export {};