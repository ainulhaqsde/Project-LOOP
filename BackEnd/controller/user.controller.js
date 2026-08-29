import { User } from "../model/user.js";

// =====================================================
// GET CURRENT USER
// =====================================================

const get_current_user_controller = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication data is missing.",
      });
    }

    const user = await User.findById(userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch current user.",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL USERS
// =====================================================

const get_all_users_controller = async (req, res) => {
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
    console.error(
      "Get all users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE USER ROLE
// =====================================================

const update_user_role_controller = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // -------------------------------------------------
    // VALIDATE ROLE
    // -------------------------------------------------

    const allowedRoles = [
      "admin",
      "manager",
      "member",
    ];

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
    // UPDATE ROLE
    // -------------------------------------------------

    user.role = role;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      user: {
        id: user._id,
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
      message: "Failed to update user role.",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE USER
// =====================================================

const delete_user_controller = async (req, res) => {
  try {
    const { id } = req.params;

    // -------------------------------------------------
    // PREVENT ADMIN FROM DELETING THEMSELVES
    // -------------------------------------------------

    if (req.user?.userId === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    // -------------------------------------------------
    // DELETE USER
    // -------------------------------------------------

    const deletedUser =
      await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete user.",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

export {
  get_current_user_controller,
  get_all_users_controller,
  update_user_role_controller,
  delete_user_controller,
};