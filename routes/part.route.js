import express from "express";

import * as partController from "../controllers/part.controller.js";

const router = express.Router();

router.get("/", partController.getParts);

router.get("/:partId", partController.getPart);

router.post("/", partController.createPart);

router.patch("/:partId", partController.updatePart);

router.delete("/:partId", partController.deletePart);

export default router;
