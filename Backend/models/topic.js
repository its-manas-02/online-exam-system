import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String, 
    unique: true,
    lowercase: true,
  },

  description: String,

}, { timestamps: true });

export default mongoose.model("Topic", topicSchema);