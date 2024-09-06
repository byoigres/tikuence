import { RouteOptions, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import { UrlIDType } from '../../plugins/url-id';

type RequestParams = {
  urlId: string;
};

const decodeUrlID: RouteOptionsPreObject = {
  assign: "listId",
  method: async (request, h) => {
    const { urlId } = request.params as RequestParams;
    const id = request.server.methods.decodeUrlID(UrlIDType.LISTS, urlId);

    if (id === null) {
      return h.response("Not found").code(404).takeover();
    }

    return id;
  },
};

const getList: RouteOptionsPreObject = {
  assign: "title",
  method: async (request, h) => {
    const listId = request.pre.listId as number;
    const { Lists } = request.server.plugins.sequelize.models;
    const list = await Lists.findByPk(listId);

    if (!list) {
      return h.response("Not found").code(404).takeover();
    }

    return list.title;
  },
};

const handler: Lifecycle.Method = async (request, h) => {
  const title = request.pre.title as string;
  return h.inertia("Lists/View", {  
    title,
  }, {
    title: "Add a new list",
  });
};

const viewList: RouteOptions = {
  pre: [
    decodeUrlID,
    getList,
  ],
  handler
};

export default viewList;
