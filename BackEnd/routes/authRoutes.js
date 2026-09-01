import express from "express";

import {
  login_controller,
  register_controller,
  forgot_password_controller,
  reset_password_controller,
} from "../controller/auth.controller.js";

const authRoutes = express.Router();

// =====================================================
// REGISTER
// =====================================================

authRoutes.post(
  "/register",
  register_controller
);

// =====================================================
// LOGIN
// =====================================================

authRoutes.post(
  "/login",
  login_controller
);

// =====================================================
// FORGOT PASSWORD
// =====================================================

authRoutes.post(
  "/forgot-password",
  forgot_password_controller
);

// =====================================================
// RESET PASSWORD
// =====================================================

authRoutes.post(
  "/reset-password/:token",
  reset_password_controller
);

export { authRoutes };