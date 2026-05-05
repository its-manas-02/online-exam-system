import express from "express";
import { addQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";
import Topic from "../models/Topic.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import { submitQuiz } from "../controllers/resultController.js";

const router = express.Router();

// ====================== QUIZ ROUTES ======================

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

// Get Quizzes by Topic Slug
router.get("/quiz/topic/:slug", async (req, res) => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug });
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const quizzes = await Quiz.find({ topic: topic._id })
      .select("title slug description")
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single Quiz by Slug + Questions (Important)
router.get("/quiz/:quizSlug", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ slug: req.params.quizSlug })
      .populate("topic", "name slug");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questions = await Question.find({ quiz: quiz._id })
      .select("question options correctAnswer");

    res.json({
      ...quiz.toObject(),
      questions: questions
    });

  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error while fetching quiz" });
  }
});

router.post("/quiz/submit", protect, submitQuiz);

export default router;