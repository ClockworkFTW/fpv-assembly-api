import express from "express";
import buildPartController from "../controllers/build-part.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, buildPartController.createBuildPart);

router.patch("/:buildPartId", auth, buildPartController.updateBuildPart);

router.delete("/:buildPartId", auth, buildPartController.deleteBuildPart);

export default router;
