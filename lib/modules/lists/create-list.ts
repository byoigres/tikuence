import { RouteOptions, RouteOptionsValidate, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import Joi from 'joi';
import { getJoiMessages } from "../../server/failAction"
import { UserProfile } from "../auth/google"

const getMessages = getJoiMessages([
  {
    name: "title",
    messages: [
      {
        types: ["any.required", "string.empty"],
        message: "You must provide a title",
      },
    ],
  },
  {
    name: "categories",
    messages: [
      {
        types: ["any.required"],
        message: "You must select a category",
      },
    ],
  },
  {
    name: "languages",
    messages: [
      {
        types: ["any.required"],
        message: "You must select a language",
      },
    ],
  },
]);

type Payload = {
  title: string;
  categories: string[];
  language_code: string;
}

const validate: RouteOptionsValidate = {
  payload: Joi.object({
    title: Joi.string().required().label("title").messages(getMessages("title")),
    categories: Joi.array().items(Joi.string().required()).min(1).max(3).label("categories").messages(getMessages("categories")),
    language_code: Joi.string().optional().label("languages"),
  }),
};

const getCategoryIds: RouteOptionsPreObject = {
  assign: "categoryIds",
  method: async (request, h) => {
    const payload = request.payload as Payload;
    const { models } = request.server.plugins["plugins/sequelize"];

    const categories = await models.Categories.findAll({
      attributes: ["id"],
      where: {
        url_identifier: payload.categories,
      },
    });

    return categories.map((category) => category.id);
  },
};

const createList: RouteOptionsPreObject = {
  assign: "listId",
  method: async (request, h) => {
    const payload = request.payload as Payload;
    const { id: user_id } = request.auth.credentials as { id:number };
    const categoryIds = request.pre.categoryIds as number[];

    const { models, sequelize } = request.server.plugins["plugins/sequelize"]

    const transaction = await sequelize.transaction();

    try {
      const list = await models.Lists.create({
        title: payload.title,
        user_id,
        url_uid: Date.now().toString(),
      }, {
        transaction,
        returning: ["id"],
      });

      await models.ListsCategories.bulkCreate(categoryIds.map((category_id) => ({
        list_id: list.id,
        category_id,
      })), {
        transaction,
      });

      await transaction.commit();

      return list.id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

const handler: Lifecycle.Method = async (request, h) => {
  const id = request.pre.listId as number;
  request.yar.flash("success", `List created successfully with id: ${id}`);
  return h.redirect("/lists/add");
}

const createListOptions: RouteOptions = {
  auth: {
    mode: "try",
    strategy: "session",
  },
  validate,
  pre: [
    getCategoryIds,
    createList,
  ],
  handler,
};

export default createListOptions;
