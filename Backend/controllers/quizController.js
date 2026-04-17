import Topic from "../models/Topic.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";

export const addQuiz = async (req, res) => {
  try {
    const { topic, title, questions } = req.body;
    const generateSlug = (text) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")     // spaces → -
        .replace(/[^\w-]+/g, ""); // remove special chars
    };

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: "Questions required" });
    }


    // 1. Find or create topic
    let existingTopic = await Topic.findOne({ name: { $regex: `^${topic}$`, $options: "i" } });

    if (!existingTopic) {
      const slug = generateSlug(topic);
      let count = 1;

      while (await Topic.findOne({ slug })) {
        slug = `${generateSlug(topic)}-${count++}`;
      }

      existingTopic = new Topic({ name: topic, slug });
      await existingTopic.save();
    }

    // 2. Create quiz
    const newQuiz = new Quiz({
      title,
      topic: existingTopic._id,
      createdBy: req.user.id,
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