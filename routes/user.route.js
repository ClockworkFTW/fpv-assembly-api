import express from "express";
import auth from "../middleware/auth.js";
import { roles } from "../models/user.model.js";
import validate from "../middleware/validate.js";
import userValidation from "../validations/user.validation.js";
import userController from "../controllers/user.controller.js";

const router = express.Router();

/**
 * Get user
 */
router.get("/", userController.getUsers);

/**
 * Get user
 */
router.get(
  "/:userId",
  validate(userValidation.getUser),
  userController.getUser
);

/**
 * Update user
 */
router.patch(
  "/:userId",
  auth([roles.user, roles.admin]),
  userController.updateUser
);

/**
 * Delete user
 */
router.delete(
  "/:userId",
  auth([roles.user, roles.admin]),
  userController.deleteUser
);

export default router;
