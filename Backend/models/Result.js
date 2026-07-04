import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  score: Number,
  total: Number,
  timeTaken: Number,
  answers: {
    type: Map,
    of: Number, // Store question._id -> answer index mapping
    default: new Map()
  },
  correctAnswers: {
    type: Map,
    of: Number, // Store question._id -> correct answer index mapping
    default: new Map()
  }
}, { timestamps: true });

// Add indexes for faster queries
resultSchema.index({ user: 1, quiz: 1 });
resultSchema.index({ user: 1 });
resultSchema.index({ quiz: 1 });

export default mongoose.model("Result", resultSchema);