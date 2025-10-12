import { Request, Response } from "express";
import { prisma } from "../../utils/prisma.js";

export class AuthController {
  /**
   * GET /auth/me
   * Get current authenticated user with role
   */
  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Fetch full user details from database
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      console.error("Get current user error:", error);
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  /**
   * PATCH /auth/me
   * Update current authenticated user profile
   */
  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { name, avatarUrl } = req.body;

      // Validate input
      if (name !== undefined && typeof name !== "string") {
        return res.status(400).json({ error: "Name must be a string" });
      }
      if (avatarUrl !== undefined && typeof avatarUrl !== "string") {
        return res.status(400).json({ error: "Avatar URL must be a string" });
      }

      // Build update object with only provided fields
      const updateData: any = {};
      if (name !== undefined) updateData.name = name.trim() || null;
      if (avatarUrl !== undefined)
        updateData.avatarUrl = avatarUrl.trim() || null;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      // Update user profile
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: updateData,
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.json(updatedUser);
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({ error: "Failed to update profile" });
    }
  }
}
