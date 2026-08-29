import express from "express";

import {
  get_current_user_controller,
  get_all_users_controller,
  update_user_role_controller,
  delete_user_controller,
} from "../controller/user.controller.js";

import {
  authMiddleware,
} from "../middleware/authMiddleware.js";

import {
  allowRoles,
} from "../middleware/roleMiddleware.js";

const userRoutes = express.Router();

// =====================================================
// CURRENT LOGGED-IN USER
// =====================================================

userRoutes.get(
  "/me",
  authMiddleware,
  get_current_user_controller
);

// =====================================================
// GET ALL USERS
// ADMIN ONLY
// =====================================================

userRoutes.get(
  "/",
  authMiddleware,
  allowRoles("admin"),
  get_all_users_controller
);

// =====================================================
// UPDATE USER ROLE
// ADMIN ONLY
// =====================================================

userRoutes.put(
  "/:id/role",
  authMiddleware,
  allowRoles("admin"),
  update_user_role_controller
);

// =====================================================
// DELETE USER
// ADMIN ONLY
// =====================================================

userRoutes.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin"),
  delete_user_controller
);

// =====================================================
// EXPORT
// =====================================================

export {
  userRoutes,
};