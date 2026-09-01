import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../model/user.js";
import { z } from "zod";
import { sendPasswordResetEmail } from "../services/emailService.js";


// =====================================================
// REGISTER CONTROLLER
// =====================================================

const register_controller = async (req, res) => {

  const user_schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  });


  try {

    const isValid = user_schema.safeParse(req.body);


    if (!isValid.success) {

      return res.status(400).json({
        success: false,
        message:
          isValid.error.issues[0]?.message ||
          "Invalid input",
      });

    }


    const {
      name,
      email,
      password,
      confirmPassword,
    } = isValid.data;


    if (password !== confirmPassword) {

      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });

    }


    const existingUser = await User.findOne({
      email,
    });


    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });

    }


    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });


    return res.status(201).json({

      success: true,

      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

    });


  } catch (error) {

    console.error(
      "Registration error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });

  }

};


// =====================================================
// LOGIN CONTROLLER
// =====================================================

const login_controller = async (req, res) => {

  const login_schema = z.object({

    email: z.email("Invalid email address"),

    password: z.string().min(
      1,
      "Password is required"
    ),

  });


  try {

    const isValid = login_schema.safeParse(
      req.body
    );


    if (!isValid.success) {

      return res.status(400).json({

        success: false,

        message:
          isValid.error.issues[0]?.message ||
          "Invalid input",

      });

    }


    const {
      email,
      password,
    } = isValid.data;


    const user = await User.findOne({
      email,
    });


    if (!user) {

      return res.status(401).json({

        success: false,

        message: "Invalid email or password",

      });

    }


    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!isPasswordCorrect) {

      return res.status(401).json({

        success: false,

        message: "Invalid email or password",

      });

    }


    if (!process.env.JWT_SECRET) {

      console.error(
        "JWT_SECRET is missing from .env"
      );


      return res.status(500).json({

        success: false,

        message:
          "Server authentication configuration error",

      });

    }


    const token = jwt.sign(

      {
        userId: user._id.toString(),
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }

    );


    return res.status(200).json({

      success: true,

      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

    });


  } catch (error) {

    console.error(
      "Login error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Server error",

      error: error.message,

    });

  }

};


// =====================================================
// FORGOT PASSWORD CONTROLLER
// =====================================================

const forgot_password_controller = async (req, res) => {

  const forgotPasswordSchema = z.object({
    email: z.email("Invalid email address"),
  });


  try {

    const isValid =
      forgotPasswordSchema.safeParse(
        req.body
      );


    if (!isValid.success) {

      return res.status(400).json({

        success: false,

        message:
          isValid.error.issues[0]?.message ||
          "Invalid email address",

      });

    }


    const { email } = isValid.data;


    const user = await User.findOne({
      email,
    });


    // Do not reveal whether the account exists.
    if (!user) {

      return res.status(200).json({

        success: true,

        message:
          "If an account exists for that email, a password reset link has been sent.",

      });

    }


    // Generate secure random reset token.
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");


    // Store only the hashed version in MongoDB.
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");


    user.passwordResetToken =
      hashedResetToken;

    user.passwordResetExpires =
      Date.now() + 15 * 60 * 1000;


    await user.save();


    // Create frontend reset URL.
    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:5173";


    const resetUrl =
      `${frontendUrl}/reset-password/${resetToken}`;


    // Send reset link through Resend.
    try {

      await sendPasswordResetEmail(
        user.email,
        resetUrl
      );

    } catch (emailError) {

      console.error(
        "Password reset email error:",
        emailError
      );


      // Remove the reset token if email delivery fails.
      user.passwordResetToken = null;
      user.passwordResetExpires = null;

      await user.save();


      return res.status(500).json({

        success: false,

        message:
          "Unable to send password reset email. Please try again later.",

      });

    }


    return res.status(200).json({

      success: true,

      message:
        "If an account exists for that email, a password reset link has been sent.",

    });


  } catch (error) {

    console.error(
      "Forgot password error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to process password reset request.",

    });

  }

};


// =====================================================
// RESET PASSWORD CONTROLLER
// =====================================================

const reset_password_controller = async (req, res) => {

  const resetPasswordSchema = z.object({

    password: z
      .string()
      .min(
        6,
        "Password must be at least 6 characters"
      ),

    confirmPassword: z
      .string()
      .min(
        6,
        "Confirm password must be at least 6 characters"
      ),

  });


  try {

    const isValid =
      resetPasswordSchema.safeParse(
        req.body
      );


    if (!isValid.success) {

      return res.status(400).json({

        success: false,

        message:
          isValid.error.issues[0]?.message ||
          "Invalid password",

      });

    }


    const {
      password,
      confirmPassword,
    } = isValid.data;


    if (password !== confirmPassword) {

      return res.status(400).json({

        success: false,

        message:
          "Passwords do not match",

      });

    }


    const { token } = req.params;


    if (!token) {

      return res.status(400).json({

        success: false,

        message:
          "Password reset token is required.",

      });

    }


    const hashedResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");


    const user = await User.findOne({

      passwordResetToken:
        hashedResetToken,

      passwordResetExpires: {
        $gt: Date.now(),
      },

    });


    if (!user) {

      return res.status(400).json({

        success: false,

        message:
          "Password reset link is invalid or has expired.",

      });

    }


    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    user.password = hashedPassword;

    user.passwordResetToken = null;

    user.passwordResetExpires = null;


    await user.save();


    return res.status(200).json({

      success: true,

      message:
        "Password reset successfully. You can now sign in with your new password.",

    });


  } catch (error) {

    console.error(
      "Reset password error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to reset password.",

    });

  }

};


// =====================================================
// EXPORT
// =====================================================

export {
  register_controller,
  login_controller,
  forgot_password_controller,
  reset_password_controller,
};