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
}
