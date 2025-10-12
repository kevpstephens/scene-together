import { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";

/**
 * Create or update RSVP for an event
 * Authenticated users only
 */
export async function createOrUpdateRSVP(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { status } = req.body;
    const { id: eventId } = req.params;
    const userId = req.user!.id;

    // Check if event exists and has capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { rsvps: { where: { status: "going" } } },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check capacity if user is RSVPing as "going"
    if (
      event.maxCapacity &&
      event._count.rsvps >= event.maxCapacity &&
      status === "going"
    ) {
      return res.status(400).json({ error: "Event is at full capacity" });
    }

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
 * Get all RSVPs for the authenticated user
 * Authenticated users only
 */
export async function getUserRSVPs(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
 * Authenticated users only
 */
export async function deleteRSVP(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: eventId } = req.params;
    const userId = req.user!.id;

    // Check if RSVP exists
    const rsvp = await prisma.rSVP.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (!rsvp) {
      return res.status(404).json({ error: "RSVP not found" });
    }

    // Delete the RSVP
    await prisma.rSVP.delete({
      where: { userId_eventId: { userId, eventId } },
    });

    res.status(200).json({ message: "RSVP deleted successfully" });
  } catch (error) {
    next(error);
  }
}
