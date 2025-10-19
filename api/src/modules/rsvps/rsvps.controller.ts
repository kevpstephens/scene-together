/*===============================================
 * RSVPs Controller
 * ==============================================
 * Handles RSVP creation, updates, and deletion for events.
 * All endpoints require authentication.
 * ==============================================
 */

import { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";

/**
 * Create or update RSVP for an event
 *
 * POST /events/:id/rsvp
 *
 * Creates new RSVP or updates existing one (upsert).
 * Validates event capacity before allowing "going" status.
 * Requires authentication.
 *
 * @param req.params.id - Event UUID
 * @param req.body.status - RSVP status: "going", "interested", or "not_going"
 * @returns Created or updated RSVP
 */
export async function createOrUpdateRSVP(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { status } = req.body;
    const { id: eventId } = req.params;
    const userId = req.user!.id;

    // Check event exists and get current attendee count
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { rsvps: { where: { status: "going" } } },
        },
      },
    });

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    // Validate capacity before allowing "going" status
    if (
      event.maxCapacity &&
      event._count.rsvps >= event.maxCapacity &&
      status === "going"
    ) {
      res.status(400).json({ error: "Event is at full capacity" });
      return;
    }

    // Create or update RSVP
    const rsvp = await prisma.rSVP.upsert({
      where: { userId_eventId: { userId, eventId } },
      update: { status },
      create: { userId, eventId, status },
    });

    res.status(201).json(rsvp);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all RSVPs for current user
 *
 * GET /me/rsvps
 *
 * Returns all RSVPs for the authenticated user with event details.
 * Ordered by event date (earliest first).
 * Requires authentication.
 *
 * @returns Array of RSVPs with full event details
 */
export async function getUserRSVPs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const rsvps = await prisma.rSVP.findMany({
      where: { userId: req.user!.id },
      include: {
        event: true,
      },
      orderBy: {
        event: {
          date: "asc",
        },
      },
    });

    res.json(rsvps);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an RSVP for an event
 *
 * DELETE /events/:id/rsvp
 *
 * Removes the user's RSVP for a specific event.
 * Can only delete own RSVPs.
 * Requires authentication.
 *
 * @param req.params.id - Event UUID
 * @returns Success message
 */
export async function deleteRSVP(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: eventId } = req.params;
    const userId = req.user!.id;

    // Verify RSVP exists
    const rsvp = await prisma.rSVP.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (!rsvp) {
      res.status(404).json({ error: "RSVP not found" });
      return;
    }

    // Delete RSVP
    await prisma.rSVP.delete({
      where: { userId_eventId: { userId, eventId } },
    });

    res.json({ message: "RSVP deleted successfully" });
  } catch (error) {
    next(error);
  }
}
