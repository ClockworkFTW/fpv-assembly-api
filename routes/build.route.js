import express from "express";
import buildController from "../controllers/build.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, buildController.createBuild);

router.get("/", buildController.getBuilds);

router.get("/:buildId", buildController.getBuild);

router.patch("/:buildId", auth, buildController.updateBuild);

router.delete("/:buildId", auth, buildController.deleteBuild);

router.post("/:buildId/parts", auth, buildController.createBuildPart);

router.patch("/:buildId/parts/:partId", auth, buildController.updateBuildPart);

router.delete("/:buildId/parts/:partId", auth, buildController.deleteBuildPart);

export default router;
