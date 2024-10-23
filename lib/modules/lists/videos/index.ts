import { ServerRoute } from "@hapi/hapi";
import addVideo from "./add-video";
import append from "./append";

const VideosRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/lists/{listId}/videos/add",
    options: addVideo,
  },
  {
    method: "POST",
    path: "/lists/{listUrlId}/videos",
    options: append,
  },
];

export default VideosRoutes;
