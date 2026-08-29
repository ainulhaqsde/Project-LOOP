import express from "express";

import Feedback from "../model/feedback.js";

import {
  analyzeFeedbackWithAI,
  askFeedbackAI,
} from "../services/aiService.js";

import {
  authMiddleware,
} from "../middleware/authMiddleware.js";


const feedbackRoutes = express.Router();


// =====================================================
// CREATE FEEDBACK + AI ANALYSIS
// =====================================================

feedbackRoutes.post(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        customerName,
        customerEmail,
        message,
        source,
      } = req.body;


      if (!customerName || !message) {

        return res.status(400).json({
          success: false,
          message:
            "Customer name and feedback message are required",
        });

      }


      console.log(
        "Analyzing feedback with Gemini..."
      );


      const aiAnalysis =
        await analyzeFeedbackWithAI(message);


      const feedback = new Feedback({

        customerName,

        customerEmail,

        message,

        source:
          source || "manual",

        sentiment:
          aiAnalysis.sentiment,

        themes:
          aiAnalysis.themes,

        summary:
          aiAnalysis.summary,

        keyIssue:
          aiAnalysis.keyIssue,

        recommendation:
          aiAnalysis.recommendation,

      });


      const savedFeedback =
        await feedback.save();


      return res.status(201).json({

        success: true,

        message:
          "Feedback submitted and analyzed successfully",

        feedback:
          savedFeedback,

      });

    } catch (error) {

      console.error(
        "Feedback creation error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to create feedback",

        error:
          error.message,

      });

    }

  }
);


// =====================================================
// GET ALL FEEDBACK
// =====================================================

feedbackRoutes.get(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const feedbacks =
        await Feedback.find()
          .sort({
            createdAt: -1,
          });


      return res.status(200).json({

        success: true,

        feedbacks,

      });

    } catch (error) {

      console.error(
        "Get feedback error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch feedback",

        error:
          error.message,

      });

    }

  }
);


// =====================================================
// GET FEEDBACK ANALYTICS
// =====================================================

feedbackRoutes.get(
  "/analytics",
  authMiddleware,
  async (req, res) => {

    try {

      const totalFeedback =
        await Feedback.countDocuments();


      const positive =
        await Feedback.countDocuments({
          sentiment: "positive",
        });


      const negative =
        await Feedback.countDocuments({
          sentiment: "negative",
        });


      const neutral =
        await Feedback.countDocuments({
          sentiment: "neutral",
        });


      const feedbacks =
        await Feedback.find();


      const themeMap = {};


      feedbacks.forEach(
        (feedback) => {

          if (
            Array.isArray(
              feedback.themes
            )
          ) {

            feedback.themes.forEach(
              (theme) => {

                if (!theme) {
                  return;
                }


                const normalizedTheme =
                  theme.trim();


                if (!normalizedTheme) {
                  return;
                }


                themeMap[
                  normalizedTheme
                ] =
                  (themeMap[
                    normalizedTheme
                  ] || 0) + 1;

              }
            );

          }

        }
      );


      const themes =
        Object.entries(themeMap)
          .map(
            ([theme, count]) => ({
              theme,
              count,
            })
          )
          .sort(
            (a, b) =>
              b.count - a.count
          );


      const recentFeedback =
        await Feedback.find()
          .sort({
            createdAt: -1,
          })
          .limit(5);


      return res.status(200).json({

        success: true,

        totalFeedback,

        sentiment: {

          positive,

          negative,

          neutral,

        },

        themes,

        recentFeedback,

      });

    } catch (error) {

      console.error(
        "Analytics error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch analytics",

        error:
          error.message,

      });

    }

  }
);


// =====================================================
// ASK AI ABOUT CUSTOMER FEEDBACK
// IMPORTANT: KEEP THIS BEFORE /:id
// =====================================================

feedbackRoutes.post(
  "/ask-ai",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        question,
      } = req.body;


      // ---------------------------------------------
      // Validate question
      // ---------------------------------------------

      if (
        !question ||
        typeof question !== "string" ||
        !question.trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "AI question is required",

        });

      }


      console.log(
        "Ask AI request received."
      );

      console.log(
        "Question:",
        question.trim()
      );


      // ---------------------------------------------
      // Get feedback data
      // ---------------------------------------------

      const feedbacks =
        await Feedback.find()
          .sort({
            createdAt: -1,
          });


      // ---------------------------------------------
      // Check feedback availability
      // ---------------------------------------------

      if (
        !Array.isArray(feedbacks) ||
        feedbacks.length === 0
      ) {

        return res.status(200).json({

          success: true,

          answer:
            "There is not enough customer feedback data available yet. Please add some feedback before asking AI for business insights.",

        });

      }


      // ---------------------------------------------
      // Ask Gemini
      // ---------------------------------------------

      const answer =
        await askFeedbackAI(
          question.trim(),
          feedbacks
        );


      // ---------------------------------------------
      // Send response
      // ---------------------------------------------

      return res.status(200).json({

        success: true,

        answer,

      });

    } catch (error) {

      console.error(
        "Ask AI route error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Failed to get AI answer",

      });

    }

  }
);


// =====================================================
// GET SINGLE FEEDBACK
// =====================================================

feedbackRoutes.get(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const feedback =
        await Feedback.findById(
          req.params.id
        );


      if (!feedback) {

        return res.status(404).json({

          success: false,

          message:
            "Feedback not found",

        });

      }


      return res.status(200).json({

        success: true,

        feedback,

      });

    } catch (error) {

      console.error(
        "Get single feedback error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch feedback",

        error:
          error.message,

      });

    }

  }
);


// =====================================================
// UPDATE FEEDBACK
// =====================================================

feedbackRoutes.put(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        customerName,
        customerEmail,
        message,
        source,
      } = req.body;


      const feedback =
        await Feedback.findById(
          req.params.id
        );


      if (!feedback) {

        return res.status(404).json({

          success: false,

          message:
            "Feedback not found",

        });

      }


      if (
        message &&
        message !== feedback.message
      ) {

        console.log(
          "Re-analyzing updated feedback..."
        );


        const aiAnalysis =
          await analyzeFeedbackWithAI(
            message
          );


        feedback.sentiment =
          aiAnalysis.sentiment;


        feedback.themes =
          aiAnalysis.themes;


        feedback.summary =
          aiAnalysis.summary;


        feedback.keyIssue =
          aiAnalysis.keyIssue;


        feedback.recommendation =
          aiAnalysis.recommendation;


        feedback.message =
          message;

      }


      if (customerName) {

        feedback.customerName =
          customerName;

      }


      if (customerEmail) {

        feedback.customerEmail =
          customerEmail;

      }


      if (source) {

        feedback.source =
          source;

      }


      const updatedFeedback =
        await feedback.save();


      return res.status(200).json({

        success: true,

        message:
          "Feedback updated successfully",

        feedback:
          updatedFeedback,

      });

    } catch (error) {

      console.error(
        "Update feedback error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to update feedback",

        error:
          error.message,

      });

    }

  }
);


// =====================================================
// DELETE FEEDBACK
// =====================================================

feedbackRoutes.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const deletedFeedback =
        await Feedback.findByIdAndDelete(
          req.params.id
        );


      if (!deletedFeedback) {

        return res.status(404).json({

          success: false,

          message:
            "Feedback not found",

        });

      }


      return res.status(200).json({

        success: true,

        message:
          "Feedback deleted successfully",

      });

    } catch (error) {

      console.error(
        "Delete feedback error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to delete feedback",

        error:
          error.message,

      });

    }

  }
);


// =====================================================
// EXPORT
// =====================================================

export {
  feedbackRoutes,
};

