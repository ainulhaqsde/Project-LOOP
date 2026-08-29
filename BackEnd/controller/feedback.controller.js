import { Feedback } from "../model/feedback.js";


// ==========================================
// CREATE FEEDBACK
// ==========================================

const createFeedback = async (req, res) => {
  try {

    const {
      customerName,
      customerEmail,
      feedbackText,
      rating
    } = req.body;

    const feedback = await Feedback.create({
      customerName,
      customerEmail,
      feedbackText,
      rating,
      createdBy: req.user.userId
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};


// ==========================================
// GET ALL FEEDBACKS
// ==========================================

const getAllFeedbacks = async (req, res) => {
  try {

    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      feedbacks
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};


export {
  createFeedback,
  getAllFeedbacks
};