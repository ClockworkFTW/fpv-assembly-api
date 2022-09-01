import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", authController.signUp);

router.post("/sign-in", authController.signIn);

export default router;
