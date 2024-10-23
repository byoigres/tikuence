import {
  RouteOptions,
  RouteOptionsPreObject,
  Lifecycle
} from '@hapi/hapi';
import { UrlIDType } from '../../plugins/url-id';
import List from '../../models/list';
import Video from '../../models/video';
import ListVideo from '../../models/list_video';
import User from '../../models/user';

type RequestParams = {
  listUrlId: string;
};

type ListWithUsername = {
  url_uid: List['url_uid'];
  title: List['title'];
  username: User['username'];
}

type VideoWithOrderResult = {
  url_uid: Video['url_uid'];
  tiktok_id: Video['tiktok_id'];
  title: Video['title'];
  thumbnail_name: Video['thumbnail_name'];
  order: ListVideo['order_id'];
}

type VideoWithOrder = {
  id: string;
  tiktok_id: string;
  title: string;
  thumbnail_name: string;
  order: number;
}

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

const getListDetails: RouteOptionsPreObject = {
  assign: "list",
  method: async (request, h) => {
    const { listId } = request.pre as { listId: number };
    const {
      models: { List, User },
      sequelize,
    } = request.server.plugins.sequelize;

    const result = await List.findOne({
      attributes: [
        "url_uid",
        "title",
        [sequelize.col('"user"."username"'), 'username'],
      ],
      where: {
        id: listId,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: [],
        },
      ],
    });

    if (!result) {
      return h.response("Not found").code(404).takeover();
    }

    const list = result.dataValues as unknown as ListWithUsername;

    return list;
  },
};

const getVideos: RouteOptionsPreObject = {
  assign: "videos",
  method: async (request) => {
    const listId = request.pre.listId as number;
    const {
      sequelize,
      models: {
        List,
        Video
      }
    } = request.server.plugins.sequelize;

    const result = await Video.findAll({
      attributes: [
        'url_uid',
        'tiktok_id',
        'title',
        'thumbnail_name',
        [sequelize.literal('"lists->list_video"."order_id"'), 'order'],
      ],
      include: [
        {
          model: List,
          as: "lists",
          through: {
            as: "list_video",
            attributes: []
          },
          attributes: []
        },
      ],
      where: {
        '$lists.id$': listId,
      },
    });

    const videos = result.map((video) => {
      const values = video.dataValues as unknown as VideoWithOrderResult
      return {
        id: values.url_uid,
        title: values.title,
        tiktok_id: values.tiktok_id,
        thumbnail_name: values.thumbnail_name,
        order: values.order,
      } as VideoWithOrder;
    });

    return videos;
  },
};

const handler: Lifecycle.Method = async (request, h) => {
  const list = request.pre.list as ListWithUsername;
  const videos = request.pre.videos as VideoWithOrder[];

  return h.inertia("Lists/Details", {
    id: list.url_uid,
    title: list.title,
    username: list.username,
    videos,
  }, {
    title: "Add a new list",
  });
};

const viewList: RouteOptions = {
  auth: {
    mode: "try",
    strategy: "session",
  },
  pre: [
    decodeListUrlID,
    getListDetails,
    getVideos,
  ],
  handler
};

export default viewList;
