import { Express } from 'express'
// import home from "./home";
// import sessions from "./sessions";
// import events from "./events";
import home from './lists/list'
import lists from './lists'

function bindRoutes(app: Express) {
  app.get('/', home)
  // app.use("/sessions", sessions);
  // app.use("/events", events);
  app.use('/list', lists)
}

export default bindRoutes
