// Backend/models/questions.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],

}, { timestamps: true });

export default mongoose.model("question", questionSchema);