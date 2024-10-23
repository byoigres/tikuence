import { ServerRoute } from "@hapi/hapi";
import addView from "./add-view";
import createList from "./create-list";
import viewList from "./view";
import VideosRoutes from "./videos";
import details from "./details";

const ListsRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/lists/add",
    options: addView,
  },
  {
    method: "POST",
    path: "/lists",
    options: createList,
  },
  {
    method: "GET",
    path: "/lists/{listUrlId}",
    options: viewList,
  },
  {
    method: "GET",
    path: "/lists/{listUrlId}/details",
    options: details,
  },
  ...VideosRoutes,
];

export default ListsRoutes;
