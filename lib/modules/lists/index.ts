import { ServerRoute } from "@hapi/hapi";
import addView from "./add-view";
import createList from "./create-list";
import viewList from "./view";

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
    path: "/lists/{urlId}",
    options: viewList,
  },
];

export default ListsRoutes;
