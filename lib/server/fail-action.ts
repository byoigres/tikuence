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
  const error = err as JoiError;
  const referer = new URL(request.headers["referer"]);
  if (referer && error) {
    const errors = new Map<string, string>();

    error.details.forEach(({ message, context: { label } }) => {
      errors.set(label, message);
    });
    const path = referer.pathname + referer.search + referer.hash;
    request.yar.flash("errors", Object.fromEntries(errors.entries()));
    return h.redirect(path).takeover();
  } else {
    throw err;
  }
};

export default failAction;
