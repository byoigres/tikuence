import { RouteOptions, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import { UrlIDType } from '../../plugins/url-id';
import List from '../../models/list';
import ListVideo from '../../models/list_video';
import Video from '../../models/video';
import User from '../../models/user';

type RequestParams = {
  listUrlId: string;
};

type ListWithRecentThumbnailResult = {
  id: List['id'];
  url_uid: List['url_uid'];
  title: Video['title'];
  username: User['username'];
  thumbnail_name: Video['thumbnail_name'];
  ListVideos: [
    {
      video_id: ListVideo['order_id'];
      Video: {
        thumbnail_name: Video['thumbnail_name'];
      };
    }
  ]
}

type ListWithRecentThumbnail = {
  id: string;
  title: string;
  username: string;
  thumbnail: string | null;
};


type VideoWithOrder = {
  url_uid: Video['url_uid'];
  tiktok_id: Video['tiktok_id'];
  title: Video['title'];
  thumbnail_name: Video['thumbnail_name'];
  order: ListVideo['order_id'];
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

const getListWithRecentThumbnail: RouteOptionsPreObject = {
  assign: "listWithRecentThumbnail",
  method: async (request, h) => {
    const listId = request.pre.listId as number;
    const {
      models: {
        List,
     },
      sequelize
    } = request.server.plugins.sequelize;

    const result = await List.findOne({
      attributes: [
        'url_uid',
        'title',
        [sequelize.col('"user"."username"'), 'username'],
      ],
      where: {
        id: listId,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: [],
        },
        {
          model: ListVideo,
          as: 'ListVideos',
          attributes: [
            'video_id',
          ],
          include: [
            {
              model: Video,
              as: 'Video',
              attributes: [
                'thumbnail_name',
              ],
            },
          ],
          order: [['Video', 'created_at', 'DESC']],
          limit: 1,
        },
      ],
    });

    if (!result) {
      return h.response("Not found").code(404).takeover();
    }

    const list = result.dataValues as unknown as ListWithRecentThumbnailResult;

    const listWithRecentThumbnail: ListWithRecentThumbnail = {
      id: list.url_uid,
      title: list.title,
      username: list.username,
      thumbnail: list.ListVideos.length > 0 ? list.ListVideos[0].Video.thumbnail_name : null,
    };

    return listWithRecentThumbnail;
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

    const videos = result.map((video) => video.dataValues as unknown) as VideoWithOrder[];

    return videos;
  },
};

const handler: Lifecycle.Method = async (request, h) => {
  const listWithRecentThumbnail = request.pre.listWithRecentThumbnail as ListWithRecentThumbnail;
  const videosWithOrder = request.pre.videos as VideoWithOrder[];

  return h.inertia("Lists/View", {
    modal: {
      modalName: "view-list",
      list: listWithRecentThumbnail,
      videos: videosWithOrder
    }
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
    getListWithRecentThumbnail,
    getVideos,
  ],
  handler
};

export default viewList;
