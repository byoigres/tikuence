import { RouteOptions, RouteOptionsValidate, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import Url from 'url';
import Joi from 'joi';
import Wreck from '@hapi/wreck';
import { getJoiMessages } from "../../../server/messages"
import { decodeListUrlID } from '../view'

type Params = {
  listUrlId: string;
};

type Payload = {
  videoUrl: string;
};

type validateUrlIDResponse = {
  tiktokVideoId: string;
  tiktokVideoUrl: string;
}

interface TikTokOembed {
  version: string
  type: string
  title: string
  author_url: string
  author_name: string
  width: string
  height: string
  html: string
  thumbnail_width: number
  thumbnail_height: number
  thumbnail_url: string
  provider_url: string
  provider_name: string
}

const getMessages = getJoiMessages("append-video");

const validate: RouteOptionsValidate = {
  params: Joi.object({
    listUrlId: Joi.string().required().pattern(/^[A-Za-z0-9_]{6,15}$/).label("listUrlId").messages(getMessages("listUrlId")),
  }),
  payload: Joi.object({
    videoUrl: Joi.string().required().uri({ scheme: ['http', 'https'] }).label("videoUrl").messages(getMessages("videoUrl")),
  }),
};

const verifyList: RouteOptionsPreObject = {
  method: async (request, h) => {
    const { listUrlId } = request.params as Params;
    const listId = request.pre.listId as number;
    const { List } = request.server.plugins.sequelize.models
    const list = await List.findByPk(listId);

    if (!list) {
      request.yar.flash("error", "List not found");
      return h.redirect(`/lists/${listUrlId}/videos/add`).takeover();
    }

    if (list.user_id !== Number(request.auth.credentials.id)) {
      request.yar.flash("error", "You do not have permission to view this list");
      return h.redirect(`/lists/${listUrlId}/videos/add`).takeover();
    }

    return h.continue;
  }
};

const validateUrlID: RouteOptionsPreObject = {
  assign: "listId",
  method: async (request, h) => {
    const { listUrlId } = request.params as Params;
    const redirect = h.redirect(`/lists/${listUrlId}/videos/add`).takeover();
    const { videoUrl } = request.payload as Payload;
    const regExpPathForWeb = /^\/@[A-Za-z0-9_.]+\/video\/([0-9]+)/
    const regExpPathForMobile = /^\/v\/([0-9]+).html/
    let parsedUrl: Url.URL;

    try {
      parsedUrl = new Url.URL(videoUrl)
    } catch (error) {
      request.yar.flash("error", "That doesn't seems to be a valid url.");
      return redirect;
    }

    // TODO: If the url.URL is a shorturl, get the "real" url by following the redirection

    if (parsedUrl.hostname === 'www.tiktok.com' || parsedUrl.hostname === 'm.tiktok.com') {
      const parsedPath = parsedUrl.pathname.match(
        parsedUrl.hostname === 'www.tiktok.com' ? regExpPathForWeb : regExpPathForMobile
      );

      if (!parsedPath) {
        request.yar.flash("errors", {
          videoUrl: "Only TikTok videos are allowed"
        });

        return redirect;
      }

      const [,tiktokVideoId] = parsedPath;

      return {
        tiktokVideoId,
        tiktokVideoUrl: Url.format(parsedUrl)
      }
    }

    request.yar.flash("errors", {
      videoUrl: "Only TikTok videos are allowed"
    });

    return redirect;
  },
};

const fetchVideoInfo: RouteOptionsPreObject = {
  assign: "videoInfo",
  method: async (request, h) => {
    const { tiktokVideoUrl } = request.pre.listId as validateUrlIDResponse;
    const { payload } = await Wreck.get<TikTokOembed>(`https://www.tiktok.com/oembed?url=${tiktokVideoUrl}`, {
      json: true,
    });

    return payload;
  }
};

const extractAuthorFromUrl: RouteOptionsPreObject = {
  assign: "authorUsername",
  method: async (request, h) => {
    const { listUrlId } = request.params as Params;
    const videoInfo = request.pre.videoInfo as TikTokOembed;
    const parsedUrl = new Url.URL(videoInfo.author_url);
    const authorUsername = parsedUrl.pathname.slice(2);

    if (authorUsername.length > 24) {
      request.yar.flash("warning", "It appears that the video you are trying to add is an sponsored video, you can't do that. 😔");
      return h.redirect(`/lists/${listUrlId}/videos/add`).takeover();
    }

    return h.continue;
  }
};

const verifyIfVideoExistinList: RouteOptionsPreObject = {
  method: async (request, h) => {
    return h.continue;
  }
};

const createAuthor: RouteOptionsPreObject = {
  method: async (request, h) => {
    return h.continue;
  }
};

const createVideo: RouteOptionsPreObject = {
  method: async (request, h) => {
    return h.continue;
  }
};

const createHashtags: RouteOptionsPreObject = {
  method: async (request, h) => {
    return h.continue;
  }
};

const handler: Lifecycle.Method = async (request, h) => {
  const { listUrlId } = request.params as Params;
  request.yar.flash("success", "Video added to list");
  return h.redirect(`/lists/${listUrlId}/videos/add`);
};

const addList: RouteOptions = {
  validate,
  auth: {
    mode: "try",
    strategy: "session",
  },
  pre: [
    decodeListUrlID,
    verifyList,
    validateUrlID,
    fetchVideoInfo,
    extractAuthorFromUrl,
    verifyIfVideoExistinList,
    createAuthor,
    createVideo,
    createHashtags,
  ],
  handler
};

export default addList;
