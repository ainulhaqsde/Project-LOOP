import { User } from "../model/user.js";
import Feedback from "../model/feedback.js";

// =====================================================
// ADMIN DASHBOARD STATS
// =====================================================

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const adminUsers = await User.countDocuments({
      role: "admin",
    });

    const managerUsers = await User.countDocuments({
      role: "manager",
    });

    const memberUsers = await User.countDocuments({
      role: "member",
    });

    const totalFeedback = await Feedback.countDocuments();

    const positiveFeedback = await Feedback.countDocuments({
      sentiment: "positive",
    });

    const negativeFeedback = await Feedback.countDocuments({
      sentiment: "negative",
    });

    const neutralFeedback = await Feedback.countDocuments({
      sentiment: "neutral",
    });

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        adminUsers,
        managerUsers,
        memberUsers,
        totalFeedback,
        positiveFeedback,
        negativeFeedback,
        neutralFeedback,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin statistics.",
    });
  }
};

// =====================================================
// GET ALL USERS
// =====================================================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get admin users error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load users.",
    });
  }
};

// =====================================================
// UPDATE USER ROLE
// =====================================================

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = [
      "admin",
      "manager",
      "member",
    ];

    // -------------------------------------------------
    // VALIDATE ROLE
    // -------------------------------------------------

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role.",
      });
    }

    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // -------------------------------------------------
    // PREVENT SELF DEMOTION
    // IMPORTANT:
    // JWT contains userId, not id
    // -------------------------------------------------

    if (
      req.user?.userId?.toString() ===
        user._id.toString() &&
      role !== "admin"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot remove your own admin role.",
      });
    }

    // -------------------------------------------------
    // UPDATE ROLE
    // -------------------------------------------------

    user.role = role;

    await user.save();

    return res.status(200).json({
      success: true,

      message:
        "User role updated successfully.",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Update user role error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update user role.",
    });
  }
};

// =====================================================
// DELETE USER
// =====================================================

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // -------------------------------------------------
    // PREVENT ADMIN FROM DELETING THEMSELVES
    // IMPORTANT:
    // JWT contains userId, not id
    // -------------------------------------------------

    if (
      req.user?.userId?.toString() ===
      user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own account.",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "User deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete user.",
    });
  }
};

// =====================================================
// GET ALL FEEDBACK
// =====================================================

const getAdminFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({
        createdAt: -1,
      })
      .limit(100);

    return res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error(
      "Admin feedback error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load feedback.",
    });
  }
};

// =====================================================
// DELETE FEEDBACK
// =====================================================

const deleteAdminFeedback = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const feedback =
      await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message:
          "Feedback not found.",
      });
    }

    await Feedback.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Feedback deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Admin delete feedback error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete feedback.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

export {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAdminFeedback,
  deleteAdminFeedback,
};