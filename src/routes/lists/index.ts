import { Router } from 'express'
import list from './list'
import details from './details'
import createList from './createList'
import edit from './edit'

const router = Router()

// Route /list

router.get('/', list)

router.post('/', createList)

router.get('/:id', details)

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
