import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String, 
    unique: true 
  },

  description: String,

}, { timestamps: true });

// auto-generate slug
// topicSchema.pre("save", function (next) {
//   this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
//   next();
// });

export default mongoose.model("Topic", topicSchema);