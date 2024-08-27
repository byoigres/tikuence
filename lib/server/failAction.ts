import { Lifecycle } from "@hapi/hapi";
import { LanguageMessages } from "joi";

type PreConfiguredMessages = {
  name: string;
  messages: { types: string[]; message: string }[];
}[];

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


export const getJoiMessages =
  (config: PreConfiguredMessages) =>
    (name: string): LanguageMessages => {
      const item = config.find((x) => x.name === name);

      if (item) {
        const result: LanguageMessages = {};

        item.messages.forEach((message) => {
          message.types.forEach((type) => (result[type] = message.message));
        });

        return result;
      }

      return {};
    };

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
