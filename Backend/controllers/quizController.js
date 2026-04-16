import Topic from "../models/topic.js";
import Question from "../models/questions.js";

export const addQuiz = async (req, res) => {
  try {
    const { topic, questions } = req.body;

    if (!topic || !questions.length) {
      return res.status(400).json({ message: "Missing data" });
    }

    // 1. Create topic
    const newTopic = new Topic({ name: topic });
    await newTopic.save();

    // 2. Create questions
    const formattedQuestions = questions.map((q) => ({
      topicId: newTopic._id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    }));

    await Question.insertMany(formattedQuestions);

    res.status(201).json({
      message: "Quiz created successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};