import { RouteOptions, RouteOptionsValidate, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import Joi from 'joi';
import { UrlIDType } from "../../../lib/plugins/url-id"
import { getJoiMessages } from "../../server/messages"

const getMessages = getJoiMessages("create-list");

type Payload = {
  title: string;
  categories: string[];
  languages: string[];
}

const validate: RouteOptionsValidate = {
  payload: Joi.object({
    title: Joi.string().required().label("title").messages(getMessages("title")),
    categories: Joi.array().items(Joi.string().required()).min(1).max(3).label("categories").messages(getMessages("categories")),
    languages: Joi.array().items(Joi.string().optional()).max(2).label("languages"),
  }),
};

const getCategoryIds: RouteOptionsPreObject = {
  assign: "categoryIds",
  method: async (request) => {
    const payload = request.payload as Payload;
    const { Category } = request.server.plugins.sequelize.models;

    const categories = await Category.findAll({
      attributes: ["id"],
      where: {
        url_identifier: payload.categories,
      },
    });

    return categories.map((category) => category.id);
  },
};

const getLanguageIds: RouteOptionsPreObject = {
  assign: "languageIds",
  method: async (request) => {
    const payload = request.payload as Payload;
    const { Language } = request.server.plugins.sequelize.models;

    const languages = await Language.findAll({
      attributes: ["id"],
      where: {
        code: payload.languages,
      },
    });

    return languages.map((language) => language.id);
  },
};

const createList: RouteOptionsPreObject = {
  assign: "listUrlId",
  method: async (request) => {
    const payload = request.payload as Payload;
    const { id: user_id } = request.auth.credentials as { id:number };
    const categoryIds = request.pre.categoryIds as number[];
    const languageIds = request.pre.languageIds as number[];

    const {
      models: {
        List,
        ListCategory,
        ListLanguage,
      },
      sequelize
    } = request.server.plugins.sequelize

    const transaction = await sequelize.transaction();

    try {
      const list = await List.create({
        title: payload.title,
        user_id,
        url_uid: Date.now().toString(),
      }, {
        transaction,
        returning: ["id"],
      });
      
      const listUrlId = request.server.methods.encodeUrlID(UrlIDType.LISTS, list.id);

      await list.update({
        url_uid: listUrlId,
      }, {
        transaction
      });

      await ListCategory.bulkCreate(categoryIds.map((category_id) => ({
        list_id: list.id,
        category_id,
      })), {
        transaction,
      });

      if (languageIds.length > 0) {
        await ListLanguage.bulkCreate(languageIds.map((language_id) => ({
          list_id: list.id,
          language_id,
        })), {
          transaction,
        });
      }

      await transaction.commit();

      return list.url_uid;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

const handler: Lifecycle.Method = async (request, h) => {
  const listUrlId = request.pre.listUrlId as string;
  request.yar.flash("success", `List created successfully with URL Id: ${listUrlId}`);
  return h.redirect(`/lists/${listUrlId}/details`);
}

const createListOptions: RouteOptions = {
  auth: {
    mode: "try",
    strategy: "session",
  },
  validate,
  pre: [
    getCategoryIds,
    getLanguageIds,
    createList,
  ],
  handler,
};

export default createListOptions;
