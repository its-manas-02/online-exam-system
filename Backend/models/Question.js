import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },

  question: {
    type: String,
    required: true,
    trim: true,
  },

  options: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length === 4 && arr.every(o => o.trim() !== ""),
      message: "Exactly 4 options are required",
    },
  },

  correctAnswer: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },

}, { timestamps: true });

export default mongoose.model("Question", questionSchema);