/*===============================================
 * Auth Controller
 * ==============================================
 * Handles user profile retrieval and updates.
 * All endpoints require authentication via requireAuth middleware.
 * ==============================================
 */

import { Request, Response } from "express";
import { prisma } from "../../utils/prisma.js";

/**
 * Standard user select fields
 * Used consistently across all user queries
 */
const USER_SELECT_FIELDS = {
  id: true,
  email: true,
  role: true,
  name: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class AuthController {
  /**
   * Get current authenticated user
   *
   * GET /auth/me
   *
   * Returns full user profile including role and metadata.
   * Requires authentication via requireAuth middleware.
   *
   * @returns User profile object
   */
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      // Fetch full user details from database
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: USER_SELECT_FIELDS,
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  /**
   * Update current authenticated user profile
   *
   * PATCH /auth/me
   *
   * Allows users to update their name and avatarUrl.
   * Empty strings are converted to null.
   * Requires authentication via requireAuth middleware.
   *
   * @param req.body.name - Optional new name
   * @param req.body.avatarUrl - Optional new avatar URL
   * @returns Updated user profile object
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const { name, avatarUrl } = req.body;

      // Validate input types
      if (name !== undefined && typeof name !== "string") {
        res.status(400).json({ error: "Name must be a string" });
        return;
      }
      if (avatarUrl !== undefined && typeof avatarUrl !== "string") {
        res.status(400).json({ error: "Avatar URL must be a string" });
        return;
      }

      // Build update object with proper typing
      const updateData: {
        name?: string | null;
        avatarUrl?: string | null;
      } = {};

      // Trim and convert empty strings to null
      if (name !== undefined) {
        updateData.name = name.trim() || null;
      }
      if (avatarUrl !== undefined) {
        updateData.avatarUrl = avatarUrl.trim() || null;
      }

      // Ensure at least one field is being updated
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: "No fields to update" });
        return;
      }

      // Update user profile in database
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: updateData,
        select: USER_SELECT_FIELDS,
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
}
