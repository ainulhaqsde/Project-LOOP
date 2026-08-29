import express from "express";

import {
  login_controller,
  register_controller,
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

export { authRoutes };