// Backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["student","teacher", "admin"],
    default: "student",
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model("user", userSchema);