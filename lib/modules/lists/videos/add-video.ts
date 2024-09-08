import { RouteOptions, Lifecycle } from '@hapi/hapi';

type Params = {
  listId: string;
};

const handler: Lifecycle.Method = async (request, h) => {
  const { listId } = request.params as Params;
  return h.inertia("Lists/View", {
    modal: {
      modalName: "add-video",
      listId,
    }
  }, {
    title: "Add a new video",
  });
};

const addList: RouteOptions = {
  auth: {
    mode: "try",
    strategy: "session",
  },
  handler
};

export default addList;
