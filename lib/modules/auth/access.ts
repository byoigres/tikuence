import { RouteOptions } from '@hapi/hapi';

const access: RouteOptions = {
auth: {
    mode: "try",
    strategy: "session",
  },
  handler(request, h) {
    if (!request.auth.isAuthenticated) {
      h.redirect("/");
    }

    const isSignIn = "/auth/signin" === request.route.path;

    return h.inertia("Auth/AccessForm", {
      isSignIn,
    }, {
      title: isSignIn ? "Sign In" : "Sign Up",
    });
  },
};

export default access;
