import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import { userRoutes } from "./routes/userRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { feedbackRoutes } from "./routes/feedbackRoutes.js";
import { aiRoutes } from "./routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
// =====================================================
// APP CONFIGURATION
// =====================================================

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// =====================================================
// ROUTES
// =====================================================

app.use("/auth", authRoutes);

app.use("/feedback", feedbackRoutes);

app.use("/ai", aiRoutes);

app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Project LOOP API is running.",
  });
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `Server running on port no ${PORT}`
  );
});