import express from "express";
import partController from "../controllers/part.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", partController.getParts);

router.get("/:partId", partController.getPart);

router.post("/", auth, partController.createPart);

router.patch("/:partId", auth, partController.updatePart);

router.delete("/:partId", auth, partController.deletePart);

export default router;
