import express from "express";

import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import partRoutes from "./part.route.js";
import buildRoutes from "./build.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/parts", partRoutes);
router.use("/builds", buildRoutes);

router.get("/status", (req, res) => res.send("OK"));

export default router;
