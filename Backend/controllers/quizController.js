import Topic from "../models/Topic.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";

export const addQuiz = async (req, res) => {
  try {
    const { topic, title, questions } = req.body;

    // Helper Functions
    const generateSlug = (text) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    };

    const formatText = (text) => {
      return text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    if (!topic) return res.status(400).json({ message: "Topic is required" });
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: "Questions are required" });
    }

    const fixedTopic = formatText(topic);
    const baseTitle = formatText(title);

    // 1. Find or Create Topic
    let existingTopic = await Topic.findOne({ 
      name: { $regex: `^${fixedTopic}$`, $options: "i" } 
    });

    if (!existingTopic) {
      let topicSlug = generateSlug(fixedTopic);
      let count = 1;

      while (await Topic.findOne({ slug: topicSlug })) {
        topicSlug = `${generateSlug(fixedTopic)}-${count++}`;
      }

      existingTopic = new Topic({ name: fixedTopic, slug: topicSlug });
      await existingTopic.save();
    }

    // 2. Handle Duplicate Title with Numbering
    let finalTitle = baseTitle;
    let counter = 1;

    // Check if title already exists for this topic
    while (await Quiz.exists({ 
      topic: existingTopic._id, 
      title: finalTitle 
    })) {
      counter++;
      finalTitle = `${baseTitle} ${counter}`;
    }

    // 3. Generate Slug for Quiz (based on finalTitle)
    let quizSlug = generateSlug(finalTitle);
    let slugCounter = 1;

    while (await Quiz.exists({ 
      topic: existingTopic._id, 
      slug: quizSlug 
    })) {
      slugCounter++;
      quizSlug = `${generateSlug(baseTitle)}-${slugCounter}`;
    }

    // 4. Create Quiz with finalTitle and slug
    const newQuiz = new Quiz({
      title: finalTitle,
      slug: quizSlug,           // ← Added slug field
      topic: existingTopic._id,
      createdBy: req.user.id,
    });

    await newQuiz.save();

    // 5. Save Questions
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
      slug: newQuiz.slug,
      title: newQuiz.title,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};