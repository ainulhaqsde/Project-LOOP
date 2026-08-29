import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAdminFeedback,
  deleteAdminFeedback,
} from "../controller/admin.controller.js";

const router = express.Router();

// =====================================================
// ADMIN AUTHENTICATION + AUTHORIZATION
// =====================================================
//
// Every route below requires:
//
// 1. Valid JWT
// 2. Admin role
//
// =====================================================

// =====================================================
// ADMIN STATISTICS
// =====================================================

router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  getAdminStats
);

// =====================================================
// USER MANAGEMENT
// =====================================================

// Get all users

router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

// Update user role

router.patch(
  "/users/:id/role",
  authMiddleware,
  adminMiddleware,
  updateUserRole
);

// Delete user

router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);

// =====================================================
// FEEDBACK MANAGEMENT
// =====================================================

// Get all feedback

router.get(
  "/feedback",
  authMiddleware,
  adminMiddleware,
  getAdminFeedback
);

// Delete feedback

router.delete(
  "/feedback/:id",
  authMiddleware,
  adminMiddleware,
  deleteAdminFeedback
);

export default router;