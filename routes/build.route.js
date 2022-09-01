import express from "express";
import buildController from "../controllers/build.controller.js";

const router = express.Router();

router.get("/", buildController.getBuilds);

router.get("/:buildId", buildController.getBuild);

router.post("/", buildController.createBuild);

router.patch("/:buildId", buildController.updateBuild);

router.delete("/:buildId", buildController.deleteBuild);

export default router;
