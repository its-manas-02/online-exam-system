import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  description: String,

}, { timestamps: true });

export default mongoose.model("Topic", topicSchema);