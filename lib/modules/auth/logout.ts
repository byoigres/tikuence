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

    request.yar.flash("info", "Successfully logged out");

    return h.redirect("/");
  },
};

export default logout;
