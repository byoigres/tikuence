import { RouteOptions } from '@hapi/hapi';

const PublicOptions: RouteOptions = {
  handler: {
    directory: {
      path: ".",
      redirectToSlash: true,
    },
  }
};

export default PublicOptions;
