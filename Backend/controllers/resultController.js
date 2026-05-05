import Result from "../models/Result.js";
import Question from "../models/Question.js";

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeLeft } = req.body;
    const userId = req.user.id;

    const questions = await Question.find({ quiz: quizId });

    let score = 0;

    questions.forEach((q) => {
      const userAnswer = answers[q._id];
      if (userAnswer === q.correctAnswer) {
        score++;
      }
    });

    const result = await Result.create({
      user: userId,
      quiz: quizId,
      score,
      total: questions.length,
      timeTaken: 60 - timeLeft, // adjust if needed
    });

    res.json({
      message: "Result saved",
      score,
      total: questions.length,
      resultId: result._id,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};