import { Request } from "@hapi/hapi";

export default function (request: Request) {
  const [errors] = request.yar.flash("errors");
  const [error, success, warning, info] = [
    request.yar.flash("error")?.[0],
    request.yar.flash("success")?.[0],
    request.yar.flash("warning")?.[0],
    request.yar.flash("info")?.[0],
  ];
  return ({
    appName: request.server.app.appName,
    auth: {
      isAuthenticated: request.auth.isAuthenticated,
      // TODO: Not the best way to do this, but it works for now
      profile: request.auth.isAuthenticated
        ? request.auth.credentials
        : null,
    },
    errors: errors ?? {},
    flash: {
      error,
      success,
      warning,
      info,
    },
  });
}
