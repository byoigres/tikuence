import { RouteOptions, RouteOptionsValidate, RouteOptionsPreObject, Lifecycle } from '@hapi/hapi';
import Url from 'url';
import Joi from 'joi';
import HashtagRegex from 'hashtag-regex'
import Wreck from '@hapi/wreck';
import { getJoiMessages } from "../../../server/messages"
import { decodeListUrlID } from '../view'
import { UrlIDType } from "../../../../lib/plugins/url-id"

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

enum TikTokOembedType {
  Video = "video"
}

interface TikTokOembed {
  version: string;
  type: TikTokOembedType;
  title: string;
  author_url: string;
  author_name: string;
  width: string;
  height: string;
  html: string;
  thumbnail_width: number;
  thumbnail_height: number;
  thumbnail_url: string;
  provider_url: string;
  provider_name: string;
  author_unique_id: string;
  embed_product_id: string;
  embed_type: string;
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
  assign: "tiktokVideo",
  method: async (request, h) => {
    const { listUrlId } = request.params as Params;
    const redirect = h.redirect(`/lists/${listUrlId}/videos/add`).takeover();
    const { videoUrl } = request.payload as Payload;
    const regExpPathForWeb = /^\/@[A-Za-z0-9_.]+\/video\/([0-9]+)/
    const regExpPathForMobile = /^\/v\/([0-9]+).html/
    let parsedUrl: Url.URL;

    try {
      parsedUrl = new Url.URL(videoUrl)
    } catch {
      request.yar.flash("error", "That doesn't seems to be a valid url.");
      return redirect;
    }

    if (parsedUrl.hostname === 'vm.tiktok.com') {
      await Wreck.get(videoUrl, {
        json: true,
        redirects: 1,
        beforeRedirect: (_redirectMethod, statusCode, location, _resHeaders, _redirectOptions, next) => {
          if (statusCode === 301 || statusCode === 302) {
            parsedUrl = new Url.URL(location)
          }
          next();
        }
      });
    }

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

      const [, tiktokVideoId] = parsedPath;

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
  method: async (request) => {
    const { tiktokVideoUrl } = request.pre.tiktokVideo as validateUrlIDResponse;
    const { payload } = await Wreck.get<TikTokOembed>(`https://www.tiktok.com/oembed?url=${tiktokVideoUrl}`, {
      json: true,
    });

    return payload;
  }
};


const createAuthor: RouteOptionsPreObject = {
  assign: "authorId",
  method: async (request) => {
    const videoInfo = request.pre.videoInfo as TikTokOembed;
    const { Author } = request.server.plugins.sequelize.models;
    const [author] = await Author.findOrCreate({
      attributes: ["id"],
      where: {
        username: videoInfo.author_unique_id,
      },
      defaults: {
        username: videoInfo.author_unique_id,
        name: videoInfo.author_name,
      }
    });

    // TODO: Get oembed author profile data
    // https://developers.tiktok.com/doc/embed-creator-profiles?enter_method=left_navigation

    return author.id;
  }
};

const createVideo: RouteOptionsPreObject = {
  assign: "video",
  method: async (request, h) => {
    const listId = request.pre.listId as number;
    const { tiktokVideoId } = request.pre.tiktokVideo as validateUrlIDResponse;
    const videoInfo = request.pre.videoInfo as TikTokOembed
    const authorId = request.pre.authorId as number;

    const {
      models: {
        Video,
        List,
        ListVideo,
      },
      sequelize,
    } = request.server.plugins.sequelize;

    const transaction = await sequelize.transaction();

    try {
      const [video, created] = await Video.findOrCreate({
        where: {
          tiktok_id: tiktokVideoId,
          author_id: authorId,
        },
        include: [
          {
            model: List,
            where: {
              id: listId,
            }
          }
        ],
        defaults: {
          tiktok_id: tiktokVideoId,
          title: videoInfo.title,
          html: videoInfo.html,
          thumbnail_height: videoInfo.thumbnail_height,
          thumbnail_width: videoInfo.thumbnail_width,
          author_id: authorId,
        },
        transaction,
      });

      if (!created) {
        request.yar.flash("error", "Video already exists in the list");
        // TODO: This will prevent parsing the hashtags again if they change
        return h.redirect("/").takeover();
      }

      await video.update({
        url_uid: request.server.methods.encodeUrlID(UrlIDType.VIDEO, video.id),
        thumbnail_name: request.server.methods.encodeUrlID(UrlIDType.VIDEO_THUMBNAILS, video.id),
      }, {
        transaction,
      });

      const listVideo = await ListVideo.create({
        list_id: listId,
        video_id: video.id,
      }, {
        transaction,
      });

      const counter = await ListVideo.count({
        where: {
          list_id: listId,
        },
        transaction,
      });

      listVideo.order_id = counter;
      await listVideo.save({ transaction });

      if (counter === 1) {
        await List.update({
          video_cover_id: video.id,
        }, {
          where: {
            id: listId,
          },
          transaction,
        });
      }

      await transaction.commit();

      return {
        id: video.id,
        url_uid: video.url_uid,
        thumbnail_name: video.thumbnail_name,
      };

    } catch (error) {
      await transaction.rollback();
      console.error(error);
    }
  }
};

const uploadThumbnails: RouteOptionsPreObject = {
  method: async (request, h) => {
    const videoInfo = request.pre.videoInfo as TikTokOembed;
    const video = request.pre.video as { id: number, url_uid: string, thumbnail_name: string };
    const { uploadThumbnails } = request.server.plugins.Firebase;
    await uploadThumbnails(videoInfo.thumbnail_url, video.url_uid, video.thumbnail_name);

    return h.continue;
  }
};

const createHashtags: RouteOptionsPreObject = {
  method: async (request, h) => {
    const videoInfo = request.pre.videoInfo as TikTokOembed;
    const regex = HashtagRegex()
    const hashtagStrings = new Map()
    const {
      models: {
        Hashtag,
        ListHashtag,
      },
      sequelize
    } = request.server.plugins.sequelize;
    let match

    while ((match = regex.exec(videoInfo.title))) {
      const [singleMatch] = match
      const hashtag = singleMatch.substr(1, singleMatch.length)

      if (!hashtagStrings.has(hashtag)) {
        hashtagStrings.set(hashtag, {})
      }
    }

    const transaction = await sequelize.transaction();

    try {
      const hashtags = await Hashtag.bulkCreate([
        ...Array.from(hashtagStrings.keys()).map(hashtag => ({ hashtag })),
      ], {
        transaction,
        fields: ["hashtag"],
        ignoreDuplicates: true,
        returning: ["id"],
      });

      // TODO: also add hashtags to the video.
      const values = [
        ...hashtags.filter(hashtag => hashtag.id !== null).map(hashtag => ({
          list_id: request.pre.listId,
          hashtag_id: hashtag.id,
        })),
      ];
      await ListHashtag.bulkCreate(values, {
        transaction,
        ignoreDuplicates: true,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error(error);
    }

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
    createAuthor,
    createVideo,
    uploadThumbnails,
    createHashtags,
  ],
  handler
};

export default addList;
