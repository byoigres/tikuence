import { IInertia } from "inertia-node";

declare global {
  namespace Express {
    /**
     * @see https://stackoverflow.com/a/60981984/1301872
     */
    interface AuthInfo {
      pendingUser: {
        token: string
      }
    }
    interface User {
      pendingRegistrationToken: string | undefined;
      id: number;
      email: string;
      username: string;
      name: string;
      picture: string | null;
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