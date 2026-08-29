import express  from "express" ;

import {
  analyzeFeedbackWithAI,
} from "../services/aiService.js"

const aiRoutes = express.Router();

aiRoutes.post("/analyze", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Feedback message is required",
      });
    }

    const analysis =
      await analyzeFeedbackWithAI(message);

    res.status(200).json({
      message: "AI analysis successful",
      analysis,
    });
  } catch (error) {
    console.error("AI ROUTE ERROR:", error);

    res.status(500).json({
      message: "AI analysis failed",
      error: error.message,
      code: error.code || null,
      status: error.status || null,
    });
  }
});

export { aiRoutes };