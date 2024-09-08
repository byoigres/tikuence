import { RouteOptions, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import { UrlIDType } from '../../plugins/url-id';

type RequestParams = {
  listUrlId: string;
};

export const decodeListUrlID: RouteOptionsPreObject = {
  assign: "listId",
  method: async (request, h) => {
    const { listUrlId } = request.params as RequestParams;
    const id = request.server.methods.decodeUrlID(UrlIDType.LISTS, listUrlId);

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
    const { List } = request.server.plugins.sequelize.models;
    const list = await List.findByPk(listId);

    if (!list) {
      return h.response("Not found").code(404).takeover();
    }

    return list.title;
  },
};

const handler: Lifecycle.Method = async (request, h) => {
  const { listUrlId } = request.params as RequestParams;
  const title = request.pre.title as string;
  return h.inertia("Lists/View", {  
    id: listUrlId,
    title,
  }, {
    title: "Add a new list",
  });
};

const viewList: RouteOptions = {
  pre: [
    decodeListUrlID,
    getList,
  ],
  handler
};

export default viewList;
