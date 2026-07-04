import Result from "../models/Result.js";
import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeLeft } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!quizId || !answers) {
      return res.status(400).json({ message: "Missing required fields: quizId, answers" });
    }

    // Fetch all questions for this quiz
    const questions = await Question.find({ quiz: quizId });

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found for this quiz" });
    }

    console.log("📝 Quiz Submit Debug Info:");
    console.log("Quiz ID:", quizId);
    console.log("User ID:", userId);
    console.log("Answers received:", answers);
    console.log("Questions count:", questions.length);

    let score = 0;
    const answersMap = new Map();
    const correctAnswersMap = new Map();

    // Check each question
    questions.forEach((q) => {
      const userAnswer = answers[q._id.toString()];
      const correctAnswer = q.correctAnswer;

      // Store for reference
      answersMap.set(q._id.toString(), userAnswer || null);
      correctAnswersMap.set(q._id.toString(), correctAnswer);

      // Convert userAnswer to number if it's a string
      const userAnswerNum = typeof userAnswer === 'string' ? parseInt(userAnswer) : userAnswer;

      console.log(`Question ${q._id}:`);
      console.log(`  User Answer: ${userAnswerNum} (type: ${typeof userAnswerNum})`);
      console.log(`  Correct Answer: ${correctAnswer} (type: ${typeof correctAnswer})`);
      console.log(`  Match: ${userAnswerNum === correctAnswer}`);

      // Compare answers
      if (userAnswerNum === correctAnswer) {
        score++;
      }
    });

    console.log(`Final Score: ${score}/${questions.length}`);

    // Create result record with detailed answer tracking
    const result = await Result.create({
      user: userId,
      quiz: quizId,
      score,
      total: questions.length,
      timeTaken: Math.max(0, 60 - timeLeft), // Ensure non-negative
      answers: Object.fromEntries(answersMap),
      correctAnswers: Object.fromEntries(correctAnswersMap)
    });

    res.status(200).json({
      message: "Result saved successfully",
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      resultId: result._id,
      timeTaken: result.timeTaken
    });

  } catch (err) {
    console.error("Error in submitQuiz:", err);
    res.status(500).json({ message: err.message || "Failed to submit quiz" });
  }
};