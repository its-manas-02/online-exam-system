// Backend/routes/auth.js
import express from "express";
import { register,login } from "../controllers/authController.js";
import { addQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();

// AUTH
router.post("/register", register);
router.post("/login", login);

// QUIZ
router.post("/addquiz", protect, addQuiz);

export default router;