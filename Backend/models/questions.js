import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
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
      validator: (arr) => arr.length === 4,
      message: "Exactly 4 options are required",
    },
  },

  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },

}, { timestamps: true });

export default mongoose.model("Question", questionSchema);