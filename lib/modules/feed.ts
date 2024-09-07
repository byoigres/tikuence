import { RouteOptions } from '@hapi/hapi';

const FeedOptions: RouteOptions = {
  auth: {
    mode: "try",
    strategy: "session",
  },
  handler(_request, h) {
    return h.inertia(
      "Feed",
      {
        name: "Sergio",
        points: 1000,
      },
      {
        title: "Hey root!",
        message: "Welcome!",
        year: 2021,
      },
    );
  },
};

export default FeedOptions;
