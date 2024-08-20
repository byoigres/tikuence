import { RouteOptions } from '@hapi/hapi';

const view: RouteOptions = {
auth: {
    mode: "try",
    strategy: "session",
  },
  handler(request, h) {
    if (!request.auth.isAuthenticated) {
      h.redirect("/");
    }

    const isLogin = "/auth/login" === request.route.path;

    return h.inertia("Auth/Login", {
      isLogin: "/auth/login" === request.route.path,
    }, {
      title: isLogin ? "Login" : "Register",
    });
  },
};

export default view;
