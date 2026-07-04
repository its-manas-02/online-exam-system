import express from "express";
import { addQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";
import Topic from "../models/Topic.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import Result from "../models/Result.js";
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

// Get Rankings
router.get("/rankings", async (req, res) => {
  try {
    const rankings = await Result.aggregate([
      {
        $group: {
          _id: "$user",
          totalScore: { $sum: "$score" },
          quizzesAttempted: { $sum: 1 },
          averageScore: { $avg: "$score" }
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: 100 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 1,
          username: "$userDetails.username",
          email: "$userDetails.email",
          totalScore: 1,
          quizzesAttempted: 1,
          averageScore: { $round: ["$averageScore", 2] }
        }
      }
    ]);

    // Add rank field
    const rankedResults = rankings.map((result, index) => ({
      ...result,
      rank: index + 1
    }));

    res.json(rankedResults);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    res.status(500).json({ message: "Server error while fetching rankings" });
  }
});

// Get My Quizzes (for authenticated user)
router.get("/my-quizzes", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const quizzes = await Quiz.find({ createdBy: userId })
      .populate("topic", "name slug")
      .select("title slug topic createdAt")
      .sort({ createdAt: -1 });

    // Get question count for each quiz
    const quizzesWithCount = await Promise.all(
      quizzes.map(async (quiz) => {
        const questionCount = await Question.countDocuments({ quiz: quiz._id });
        return {
          ...quiz.toObject(),
          questionCount
        };
      })
    );

    res.json(quizzesWithCount);
  } catch (error) {
    console.error("Error fetching user quizzes:", error);
    res.status(500).json({ message: "Server error while fetching quizzes" });
  }
});

// Get user's results for a specific quiz
router.get("/quiz/:quizSlug/my-results", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const quizSlug = req.params.quizSlug;

    const quiz = await Quiz.findOne({ slug: quizSlug });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const results = await Result.find({ user: userId, quiz: quiz._id })
      .select("score total timeTaken createdAt")
      .sort({ createdAt: -1 });

    res.json({
      quizId: quiz._id,
      quizTitle: quiz.title,
      results: results,
      attemptCount: results.length,
      bestScore: results.length > 0 ? Math.max(...results.map(r => r.score)) : 0,
      lastAttempt: results.length > 0 ? results[0].createdAt : null
    });
  } catch (error) {
    console.error("Error fetching user results:", error);
    res.status(500).json({ message: "Server error while fetching results" });
  }
});

// Get all results for a quiz (for result page display)
router.get("/quiz/:quizSlug/results", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const quizSlug = req.params.quizSlug;

    console.log("📡 Fetching results for slug:", quizSlug, "user:", userId);

    const quiz = await Quiz.findOne({ slug: quizSlug });
    if (!quiz) {
      console.log("❌ Quiz not found:", quizSlug);
      return res.status(404).json({ message: "Quiz not found" });
    }

    console.log("✅ Found quiz:", quiz._id);

    const results = await Result.find({ user: userId, quiz: quiz._id })
      .select("_id score total timeTaken createdAt")
      .sort({ createdAt: -1 });

    console.log("✅ Found results:", results.length);
    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching results:", error);
    res.status(500).json({ message: "Server error while fetching results" });
  }
});

// Get detailed result review (right/wrong answers with full details)
router.get("/result/:resultId/review", protect, async (req, res) => {
  try {
    const resultId = req.params.resultId;
    const userId = req.user.id;

    // Fetch the result
    const result = await Result.findById(resultId)
      .populate("quiz")
      .populate("user", "username email");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Verify user owns this result
    if (result.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Fetch all questions with full details
    const questions = await Question.find({ quiz: result.quiz._id });

    // Build detailed review with answer details
    const detailedReview = questions.map((q) => {
      const userAnswerIndex = result.answers.get(q._id.toString());
      const correctAnswerIndex = q.correctAnswer;
      const isCorrect = userAnswerIndex === correctAnswerIndex;

      return {
        questionId: q._id,
        question: q.question,
        options: q.options,
        userAnswer: userAnswerIndex ? q.options[userAnswerIndex - 1] : null,
        userAnswerIndex,
        correctAnswer: q.options[correctAnswerIndex - 1],
        correctAnswerIndex,
        isCorrect
      };
    });

    res.json({
      resultId: result._id,
      quizTitle: result.quiz.title,
      userName: result.user.username,
      score: result.score,
      total: result.total,
      percentage: Math.round((result.score / result.total) * 100),
      timeTaken: result.timeTaken,
      submittedAt: result.createdAt,
      details: detailedReview
    });
  } catch (error) {
    console.error("Error fetching result review:", error);
    res.status(500).json({ message: "Server error while fetching result review" });
  }
});

export default router;