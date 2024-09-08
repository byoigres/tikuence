import { Lifecycle } from "@hapi/hapi";

interface ErrorDetails {
  message: string;
  path: string[];
  type: string;
  context: {
    label: string;
    value?: any;
    key: string;
    child?: string;
  };
}

interface JoiError extends Error {
  details: ErrorDetails[];
  isBoom: boolean;
  isServer: boolean;
  output: {
    statusCode: number;
    payload: {
      error: string;
    };
  };
}

const failAction: Lifecycle.FailAction = async (request, h, err) => {
  const joiError = err as JoiError;
  const referer = new URL(request.headers["referer"]);
  if (referer && joiError) {
    const errors = new Map<string, string>();
    let error = null;

    joiError.details.forEach(({ message, context: { label } }) => {
      if (Object.keys(request.params).includes(label)) {
        error = message;
      } else {
        errors.set(label, message);
      }
    });
    const path = referer.pathname + referer.search + referer.hash;
    request.yar.flash("errors", Object.fromEntries(errors.entries()));
    if (error) {
      request.yar.flash("error", error);
    }
    return h.redirect(path).takeover();
  } else {
    throw err;
  }
};

export default failAction;
