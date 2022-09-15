import express from "express";
import validate from "../middleware/validate.js";
import userValidation from "../validations/user.validation.js";
import userController from "../controllers/user.controller.js";

const router = express.Router();

/**
 * Get parts
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

export default router;
