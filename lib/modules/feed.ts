import { RouteOptions, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import List from '../models/list';
import User from '../models/user';

type ListWithUsernameResult = {
  url_uid: List['url_uid'];
  title: List['title'];
  username: User['username'];
}

type ListWithUsername = {
  id: string;
  title: string;
  username: string;
};



const getLists: RouteOptionsPreObject = {
  assign: "lists",
  method: async (request, h) => {
    const {
      models: { List, User },
      sequelize,
    } = request.server.plugins.sequelize;

    const response = await List.findAll({
      attributes: [
        "url_uid",
        "title",
        [sequelize.col('"user"."username"'), 'username'],
      ],
      limit: 10,
      include: [
        {
          model: User,
          as: "user",
          attributes: [],
        },
      ],
    });

    if (!response) {
      return h.response("Not found").code(404).takeover();
    }

    const list = response.map((list) => {
      const newList = list.dataValues as unknown as ListWithUsernameResult
      return {
        id: newList.url_uid,
        title: newList.title,
        username: newList.username,
      } as ListWithUsername;
    });

    return list;
  },
};

const handler: Lifecycle.Method = (_request, h) => {
  const lists = _request.pre.lists as ListWithUsername[];
  return h.inertia(
    "Feed",
    {
      lists,
    },
    {
      title: "Hey root!",
      message: "Welcome!",
      year: 2021,
    },
  );
}

const FeedOptions: RouteOptions = {
  auth: {
    mode: "try",
    strategy: "session",
  },
  pre: [
    getLists,
  ],
  handler,
};

export default FeedOptions;
