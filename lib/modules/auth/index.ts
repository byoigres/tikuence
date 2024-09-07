import { ServerRoute } from "@hapi/hapi";
import access from "./access";
import completeProfile from "./complete-profile";
import finishUserRegistration from "./finish-user-registration";
import logout from "./logout";
import google from "./google";

export { GoogleProfile, UserProfile } from './google';

const AuthRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/auth/signin",
    options: access,
  },
  {
    method: "GET",
    path: "/auth/signup",
    options: access,
  },
  {
    method: "GET",
    path: "/auth/logout",
    options: logout,
  },
  {
    method: "GET",
    path: "/auth/complete-profile",
    options: completeProfile,
  },
  {
    method: "POST",
    path: "/auth/complete-profile",
    options: finishUserRegistration,
  },
  {
    method: ["GET", "POST"],
    path: "/auth/google",
    options: google,
  },
];

export default AuthRoutes;
