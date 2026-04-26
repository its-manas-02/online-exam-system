// Backend/routes/routes.js
import express from "express";
import { register,login } from "../controllers/authController.js";
import { addQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";
import Topic from "../models/Topic.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";

const router = express.Router();

// AUTH
router.post("/register", register);
router.post("/login", login);

// QUIZ
router.post("/addquiz", protect, addQuiz);

// 🔥 GET ALL TOPICS
router.get("/topics", async (req, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔥 GET QUIZZES BY TOPIC slug
router.get("/quiz/topic/:slug", async (req, res) => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug });
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const quizzes = await Quiz.find({ topic: topic._id });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/quiz/:quizId/questions", async (req, res) => {
  try {
    const questions = await Question.find({ quiz: req.params.quizId });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;