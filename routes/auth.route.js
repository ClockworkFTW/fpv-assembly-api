import express from "express";
import config from "../config/variables.js";
import authController from "../controllers/auth.controller.js";

import passport from "passport";

const router = express.Router();

router.post("/sign-up/local", authController.localSignUp);

router.post("/sign-in/local", authController.localSignIn);

router.get("/sign-in/google", passport.authenticate("google"));

router.get(
  "/sign-in/google/redirect",
  passport.authenticate("google", config.passport.redirectOptions),
  authController.googleSignIn
);

router.get("/sign-in/facebook", passport.authenticate("facebook"));

router.get(
  "/sign-in/facebook/redirect",
  passport.authenticate("facebook", config.passport.redirectOptions),
  authController.facebookSignIn
);

router.get("/sign-in/apple", passport.authenticate("apple"));

router.post(
  "/sign-in/apple/redirect",
  passport.authenticate("apple", config.passport.redirectOptions),
  authController.appleSignIn
);

export default router;
