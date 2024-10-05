import { RouteOptions, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import Category from "lib/models/category";
import Language from "lib/models/language";

const getCategories: RouteOptionsPreObject = {
  assign: "categories",
  method: async (request) => {
    const { Category } = request.server.plugins.sequelize.models;

    const categories = await Category.findAll({
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
  method: async (request) => {
    const { Language } = request.server.plugins.sequelize.models;

    const languages = await Language.findAll({
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
  const categories = request.pre.categories as Category[];
  const languages = request.pre.languages as Language[];

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
