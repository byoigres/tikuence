import { Router } from 'express'
import list from './list'
import details from './details'
import deleteList from './delete'
import createList from './createList'
import edit from './edit'
import appendVideo from './appendVideo'

const router = Router()

// Route /list

router.get('/', list)

router.post('/', createList)

router.get('/:id', details)

router.delete('/:listId', deleteList)

router.post('/:listId/video', appendVideo)

router.get('/:listId/edit', edit)

export default router

// import { Router } from "express";
// import list from "./list";
// import details from "./details";
// import add from "./add";
// import edit from "./edit";

// const router = Router();

// router.get("/", list);

// router.use("/add", add);

// router.get("/:id", details);

// router.get("/:id/edit", edit);

// export default router;
