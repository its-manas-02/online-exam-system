import Topic from "../models/Topic.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";

export const addQuiz = async (req, res) => {
  try {
    const { topic, title, questions } = req.body;

    if (!topic || !title || !questions.length) {
      return res.status(400).json({ message: "Missing data" });
    }

    // 1. Find or create topic
    let existingTopic = await Topic.findOne({ name: topic });

    if (!existingTopic) {
      existingTopic = new Topic({ name: topic });
      await existingTopic.save();
    }

    // 2. Create quiz
    const newQuiz = new Quiz({
      title,
      topic: existingTopic._id,
    });

    await newQuiz.save();

    // 3. Save questions
    const formattedQuestions = questions.map((q) => ({
      quiz: newQuiz._id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    }));

    await Question.insertMany(formattedQuestions);

    res.status(201).json({
      message: "Quiz created successfully",
      quizId: newQuiz._id,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};