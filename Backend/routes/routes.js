// Backend/routes/routes.js
import express from "express";
import { register, login } from "../controllers/authController.js";
import { addQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";
import Topic from "../models/Topic.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";

const router = express.Router();

// ====================== AUTH ======================
router.post("/register", register);
router.post("/login", login);

// ====================== QUIZ ======================

// Add new quiz (protected)
router.post("/addquiz", protect, addQuiz);

// Get all topics
router.get("/topics", async (req, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔥 Get Quizzes by Topic Slug (existing - theek hai)
router.get("/quiz/topic/:slug", async (req, res) => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug });
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const quizzes = await Quiz.find({ topic: topic._id })
      .select("title slug description")   // sirf zaroori fields
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔥 NEW: Get Single Quiz by Slug + Questions (Yeh sabse important hai)
router.get("/quiz/:quizSlug", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ slug: req.params.quizSlug })
      .populate("topic", "name slug");   // topic ka naam bhi laane ke liye

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Questions fetch karo
    const questions = await Question.find({ quiz: quiz._id })
      .select("question options correctAnswer");   // sensitive fields mat bhejo

    res.json({
      ...quiz.toObject(),
      questions: questions   // questions ko quiz ke saath attach kar diya
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching quiz" });
  }
});

export default router;