import express from "express";

import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import buildRoutes from "./build.route.js";
import partRoutes from "./part.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/builds", buildRoutes);
router.use("/parts", partRoutes);

router.get("/status", (req, res) => res.send("OK"));

export default router;
