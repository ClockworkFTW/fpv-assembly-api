import express from "express";
import buildController from "../controllers/build.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, buildController.createBuild);

router.get("/", buildController.getBuilds);

router.get("/:buildId", buildController.getBuild);

router.patch("/:buildId", auth, buildController.updateBuild);

router.delete("/:buildId", auth, buildController.deleteBuild);

export default router;
