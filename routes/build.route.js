import express from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { roles } from "../models/user.model.js";
import validate from "../middleware/validate.js";
import buildValidation from "../validations/build.validation.js";
import buildController from "../controllers/build.controller.js";

const router = express.Router();

/**
 * Get builds
 */
router.get("/", buildController.getBuilds);

/**
 * Get build
 */
router.get(
  "/:buildId",
  validate(buildValidation.getBuild),
  buildController.getBuild
);

/**
 * Create build
 */
router.post("/", auth([roles.user, roles.admin]), buildController.createBuild);

/**
 * Update build
 */
router.patch(
  "/:buildId",
  auth([roles.user, roles.admin]),
  validate(buildValidation.updateBuild),
  buildController.updateBuild
);

/**
 * Delete build
 */
router.delete(
  "/:buildId",
  auth([roles.user, roles.admin]),
  validate(buildValidation.deleteBuild),
  buildController.deleteBuild
);

/**
 * Create build part
 */
router.post(
  "/:buildId/parts/:partId",
  auth([roles.user, roles.admin]),
  validate(buildValidation.createBuildPart),
  buildController.createBuildPart
);

/**
 * Update build part
 */
router.patch(
  "/:buildId/parts/:partId",
  auth([roles.user, roles.admin]),
  validate(buildValidation.updateBuildPart),
  buildController.updateBuildPart
);

/**
 * Delete build part
 */
router.delete(
  "/:buildId/parts/:partId",
  auth([roles.user, roles.admin]),
  validate(buildValidation.deleteBuildPart),
  buildController.deleteBuildPart
);

/**
 * Upload build images
 */
router.post(
  "/:buildId/images",
  auth([roles.user, roles.admin]),
  upload("build-images"),
  buildController.uploadBuildImages
);

/**
 * Reorder build images
 */
router.patch(
  "/:buildId/images",
  auth([roles.user, roles.admin]),
  buildController.reorderBuildImages
);

/**
 * Delete build image
 */
router.delete(
  "/:buildId/images/:imageId",
  auth([roles.user, roles.admin]),
  validate(buildValidation.deleteBuildImage),
  buildController.deleteBuildImage
);

export default router;
