import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";

dotenv.config();


const app = express();

// connect DB
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// route test
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", authRoutes);

// use env PORT
const PORT = process.env.PORT || 5000;

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});