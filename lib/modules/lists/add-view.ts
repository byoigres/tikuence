import { RouteOptions, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import Categories from "lib/models/categories";
import Languages from "lib/models/languages";

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

const getLanguages: RouteOptionsPreObject = {
  assign: "languages",
  method: async (request, h) => {
    const { models } = request.server.plugins["plugins/sequelize"];

    const languages = await models.Languages.findAll({
      attributes: [
        "code",
        "name"
      ],
    });

    return languages;
  },
};

const handler: Lifecycle.Method = async (request, h) => {
  const defaultComponent = "Feed";  
  const categories = request.pre.categories as Categories[];
  const languages = request.pre.languages as Languages[];

  return h.inertia(defaultComponent, {
    modal: {
      modalName: "add-list",
      categories,
      languages,
    }
  }, {
    title: "Add a new list",
  });
};

const addList: RouteOptions = {
  auth: {
    mode: "try",
    strategy: "session",
  },
  pre: [
    getCategories,
    getLanguages,
  ],
  handler
};

export default addList;
