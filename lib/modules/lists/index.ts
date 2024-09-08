import { ServerRoute } from "@hapi/hapi";
import addView from "./add-view";
import createList from "./create-list";
import viewList from "./view";
import VideosRoutes from "./videos";

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
  ...VideosRoutes,
];

export default ListsRoutes;
