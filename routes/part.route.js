import express from "express";
import auth from "../middleware/auth.js";
import { roles } from "../models/user.model.js";
import validate, { validatePart } from "../middleware/validate.js";
import partValidation, { partSchemas } from "../validations/part.validation.js";
import partController from "../controllers/part.controller.js";

const router = express.Router();

/**
 * Get parts
 */
// router.get("/", validate(partValidation.getParts), partController.getParts);
router.get("/", partController.getParts);

/**
 * Get part
 */
router.get(
  "/:partId",
  validate(partValidation.getPart),
  partController.getPart
);

/**
 * Create part
 */
router.post(
  "/",
  auth([roles.admin]),
  validate(partValidation.createPart),
  validatePart(partSchemas),
  partController.createPart
);

/**
 * Update part
 */
router.patch(
  "/:partId",
  auth([roles.admin]),
  validate(partValidation.updatePart),
  validatePart(partSchemas),
  partController.updatePart
);

/**
 * Delete part
 */
router.delete(
  "/:partId",
  auth([roles.admin]),
  validate(partValidation.deletePart),
  partController.deletePart
);

/**
 * Create part review
 */
router.post(
  "/:partId/reviews",
  auth([roles.user, roles.admin]),
  partController.createPartReview
);

/**
 * Update part review
 */
router.patch(
  "/:partId/reviews/:reviewId",
  auth([roles.user, roles.admin]),
  partController.updatePartReview
);

/**
 * Delete part review
 */
router.delete(
  "/:partId/reviews/:reviewId",
  auth([roles.user, roles.admin]),
  partController.deletePartReview
);

export default router;
