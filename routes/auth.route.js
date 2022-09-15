import express from "express";
import passport from "passport";
import config from "../config/variables.js";
import validate from "../middleware/validate.js";
import authValidation from "../validations/auth.validation.js";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * Local sign up
 */
router.post(
  "/sign-up/local",
  validate(authValidation.localSignUp),
  authController.localSignUp
);

/**
 * Local sign in
 */
router.post(
  "/sign-in/local",
  validate(authValidation.localSignIn),
  authController.localSignIn
);

/**
 * Google sign in portal
 */
router.get("/sign-in/google", passport.authenticate("google"));

/**
 * Facebook sign in portal
 */
router.get("/sign-in/facebook", passport.authenticate("facebook"));

/**
 * Apple sign in portal
 */
router.get("/sign-in/apple", passport.authenticate("apple"));

/**
 * Google sign in redirect
 */
router.get(
  "/sign-in/google/redirect",
  passport.authenticate("google", config.passport.redirectOptions),
  authController.googleSignIn
);

/**
 * Facebook sign in redirect
 */
router.get(
  "/sign-in/facebook/redirect",
  passport.authenticate("facebook", config.passport.redirectOptions),
  authController.facebookSignIn
);

/**
 * Apple sign in redirect
 */
router.post(
  "/sign-in/apple/redirect",
  passport.authenticate("apple", config.passport.redirectOptions),
  authController.appleSignIn
);

/**
 * Request email verification
 */
router.post(
  "/verify-email",
  validate(authValidation.requestEmailVerification),
  authController.requestEmailVerification
);

/**
 * Verify email
 */
router.get("/verify-email", authController.verifyEmail);

/**
 * Request password reset
 */
router.post(
  "/reset-password",
  validate(authValidation.requestPasswordReset),
  authController.requestPasswordReset
);

/**
 * Reset password
 */
router.get("/reset-password", authController.resetPassword);

export default router;
