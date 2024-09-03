import { RouteOptions, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import Categories from "lib/models/categories";

const getCategories: RouteOptionsPreObject = {
  assign: "categories",
  method: async (request, h) => {
    const { models } = request.server.plugins["plugins/sequelize"];

    const categories = await models.Categories.findAll({
      attributes: [
        ["url_identifier", "name"],
        "description"
      ],
    });

    return categories;
  },
};

const handler: Lifecycle.Method = async (request, h) => {
  const defaultComponent = "Feed";  
  const categories = request.pre.categories as Categories[];

  return h.inertia(defaultComponent, {
    modal: {
      modalName: "add-list",
      categories,
    }
  }, {
    title: "Add a new list",
  });
};

const access: RouteOptions = {
  auth: {
    mode: "try",
    strategy: "session",
  },
  pre: [
    getCategories,
  ],
  handler
};

export default access;
