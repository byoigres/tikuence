import { RouteOptions } from '@hapi/hapi';

const access: RouteOptions = {
  auth: {
    mode: "try",
    strategy: "session",
  },
  handler(request, h) {
    const defaultComponent = "Feed";
    return h.inertia(defaultComponent, {
      modal: {
        modalName: "add-list",
      }
    }, {
      title: "Add a new list",
    });
  },
};

export default access;
