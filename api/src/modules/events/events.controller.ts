/*===============================================
 * Events Controller
 * ==============================================
 * Handles event CRUD operations and attendee management.
 * Public routes: getAllEvents, getEventById
 * Admin routes: createEvent, updateEvent, deleteEvent, getEventAttendees
 * ==============================================
 */

import { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";

/**
 * Standard RSVP count configuration
 * Only counts users with "going" status
 */
const ATTENDEE_COUNT_INCLUDE = {
  _count: {
    select: {
      rsvps: {
        where: { status: "going" as const },
      },
    },
  },
} as const;

/**
 * Get all events
 *
 * GET /events
 *
 * Returns all events ordered by date (earliest first).
 * Includes attendee count (users with "going" RSVP status).
 * Public route - no authentication required.
 *
 * @returns Array of events with attendeeCount
 */
export async function getAllEvents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
      include: ATTENDEE_COUNT_INCLUDE,
    });

    // Transform _count.rsvps to top-level attendeeCount for easier client access
    const eventsWithCount = events.map((event) => ({
      ...event,
      attendeeCount: event._count.rsvps,
    }));

    res.json(eventsWithCount);
  } catch (error) {
    next(error);
  }
}

/**
 * Get single event by ID
 *
 * GET /events/:id
 *
 * Returns detailed information for a specific event.
 * Includes attendee count (users with "going" RSVP status).
 * Public route - no authentication required.
 *
 * @param req.params.id - Event UUID
 * @returns Event object with attendeeCount
 */
export async function getEventById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: ATTENDEE_COUNT_INCLUDE,
    });

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    // Transform _count.rsvps to top-level attendeeCount
    const eventWithCount = {
      ...event,
      attendeeCount: event._count.rsvps,
    };

    res.json(eventWithCount);
  } catch (error) {
    next(error);
  }
}

/**
 * Create new event
 *
 * POST /events
 *
 * Creates a new event with movie metadata and pricing configuration.
 * Requires ADMIN or SUPER_ADMIN role.
 *
 * @param req.body - Event data (validated by createEventSchema)
 * @returns Created event object
 */
export async function createEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      title,
      description,
      date,
      location,
      onlineLink,
      movieId,
      movieData,
      maxCapacity,
      price,
      payWhatYouCan,
      minPrice,
    } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        onlineLink,
        movieId,
        movieData: movieData || null,
        maxCapacity,
        price: price ?? null,
        payWhatYouCan: payWhatYouCan ?? false,
        minPrice: minPrice ?? null,
        createdById: req.user!.id,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
}

/**
 * Update existing event
 *
 * PUT /events/:id
 *
 * Updates an existing event. Only provided fields are updated.
 * Requires ADMIN or SUPER_ADMIN role.
 *
 * @param req.params.id - Event UUID
 * @param req.body - Partial event data (validated by updateEventSchema)
 * @returns Updated event object
 */
export async function updateEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      title,
      description,
      date,
      location,
      onlineLink,
      movieId,
      movieData,
      maxCapacity,
      price,
      payWhatYouCan,
      minPrice,
    } = req.body;

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        location,
        onlineLink,
        movieId,
        movieData: movieData ?? null,
        maxCapacity,
        price: price !== undefined ? price : undefined,
        payWhatYouCan: payWhatYouCan !== undefined ? payWhatYouCan : undefined,
        minPrice: minPrice !== undefined ? minPrice : undefined,
      },
    });

    res.json(event);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete event
 *
 * DELETE /events/:id
 *
 * Permanently deletes an event and all associated RSVPs.
 * Requires ADMIN or SUPER_ADMIN role.
 *
 * @param req.params.id - Event UUID
 * @returns Success message
 */
export async function deleteEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await prisma.event.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all attendees for an event
 *
 * GET /events/:id/attendees
 *
 * Returns all RSVPs for an event with user information.
 * Ordered by RSVP creation time (most recent first).
 * Requires ADMIN or SUPER_ADMIN role.
 *
 * @param req.params.id - Event UUID
 * @returns Array of RSVPs with user details
 */
export async function getEventAttendees(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    // Verify event exists before fetching attendees
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    // Get all RSVPs with user information
    const attendees = await prisma.rSVP.findMany({
      where: { eventId: id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(attendees);
  } catch (error) {
    next(error);
  }
}
