import { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";

/**
 * Get all events with RSVP counts
 * Public route
 */
export async function getAllEvents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
      include: {
        _count: {
          select: { rsvps: true },
        },
      },
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
}

/**
 * Get single event by ID
 * Public route
 */
export async function getEventById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        _count: {
          select: { rsvps: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
}

/**
 * Create new event
 * Staff only
 */
export async function createEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
 * Staff only
 */
export async function updateEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
        movieData: movieData || null,
        maxCapacity,
      },
    });

    res.json(event);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete event
 * Staff only
 */
export async function deleteEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await prisma.event.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
}
