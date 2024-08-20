import { RouteOptions } from '@hapi/hapi';

const logout: RouteOptions = {
  auth: {
    mode: "required",
    strategy: "session",
  },
  handler(request, h) {
    if (request.auth.isAuthenticated) {
      request.cookieAuth.clear();
    }

    h.redirect("/");
  },
};

export default logout;
