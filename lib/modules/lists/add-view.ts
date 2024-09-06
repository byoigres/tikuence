import { RouteOptions, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import Categories from "lib/models/categories";
import Languages from "lib/models/languages";

const getCategories: RouteOptionsPreObject = {
  assign: "categories",
  method: async (request, h) => {
    const { Categories } = request.server.plugins.sequelize.models;

    const categories = await Categories.findAll({
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
    const { Languages } = request.server.plugins.sequelize.models;

    const languages = await Languages.findAll({
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
