// src/index.js

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import mysessionsRoutes from "./routes/mysessions.routes.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://arvyax-wellness.vercel.app", // your production frontend URL
    ],
    credentials: true,
  })
);

// Built-in middleware to parse JSON
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/my-sessions", mysessionsRoutes);

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
