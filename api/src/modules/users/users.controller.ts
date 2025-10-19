/*===============================================
 * Users Controller
 * ==============================================
 * Handles user profile fetching and user-created events.
 * Public routes: getUserProfile, getUserEvents
 * ==============================================
 */

import { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";

/**
 * Get user profile by ID
 *
 * GET /users/:id
 *
 * Returns public user information (name, avatar, role).
 * Used for viewing organizer profiles.
 * Public route - no authentication required.
 *
 * @param req.params.id - User UUID
 * @returns User profile object
 */
export async function getUserProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}

/**
 * Get events created by a user
 *
 * GET /users/:id/events
 *
 * Returns all events created by the specified user.
 * Ordered by date (earliest first).
 * Public route - no authentication required.
 *
 * @param req.params.id - User UUID
 * @returns Array of events created by the user
 */
export async function getUserEvents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Get all events created by this user
    const events = await prisma.event.findMany({
      where: { createdById: id },
      orderBy: { date: "asc" },
      include: {
        _count: {
          select: {
            rsvps: {
              where: { status: "going" as const },
            },
          },
        },
      },
    });

    // Transform _count.rsvps to top-level attendeeCount
    const eventsWithCount = events.map((event) => ({
      ...event,
      attendeeCount: event._count.rsvps,
    }));

    res.json(eventsWithCount);
  } catch (error) {
    next(error);
  }
}
