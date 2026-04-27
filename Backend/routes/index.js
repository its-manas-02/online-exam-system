import express from "express";
import authRoutes from "./authRoutes.js";
import quizRoutes from "./quizRoutes.js";

const router = express.Router();

// Mount all route groups
router.use("/auth", authRoutes);     // → /auth/register, /auth/login
router.use("/", quizRoutes);     // → /quiz/topic/:slug, /quiz/:quizSlug, etc.

export default router;