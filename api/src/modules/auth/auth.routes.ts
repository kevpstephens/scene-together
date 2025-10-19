/*===============================================
 * Auth Routes
 * ==============================================
 * User profile endpoints.
 * All routes require authentication.
 * ==============================================
 */

import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();
const authController = new AuthController();

/**
 * GET /auth/me
 * Get current authenticated user profile
 */
router.get("/me", requireAuth, (req, res) =>
  authController.getCurrentUser(req, res)
);

/**
 * PATCH /auth/me
 * Update current user profile (name, avatarUrl)
 */
router.patch("/me", requireAuth, (req, res) =>
  authController.updateProfile(req, res)
);

export default router;
