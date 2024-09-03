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
  category_id: number;
  language_code: string;
}

const validate: RouteOptionsValidate = {
  payload: Joi.object({
    title: Joi.string().required().label("title").messages(getMessages("title")),
    category_id: Joi.number().optional().label("categories"),
    language_code: Joi.string().optional().label("languages"),
  }),
};

const createList: RouteOptionsPreObject = {
  assign: "listId",
  method: async (request, h) => {
    const { title } = request.payload as Payload;
    // TODO: Update the tyupe of credentials object.
    const { id } = request.auth.credentials as { id:number };
    const { models } = request.server.plugins["plugins/sequelize"]

    const list = await models.Lists.create({
      title,
      user_id: id,
      url_uid: Date.now().toString(),
    }, {
      returning: ["id"],
    });
    
    return list.id;
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
    createList,
  ],
  handler,
};

export default createListOptions;
