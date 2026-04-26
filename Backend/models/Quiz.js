import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  
  slug: {
    type: String, 
    unique: true,
    lowercase: true,
  },

  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // 👈 link to user
    required: true,
  },

}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);