import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireStaff } from "./middleware/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ==================== PUBLIC ROUTES ====================
app.get("/health", (_req, res) => res.json({ ok: true }));

// List events (public)
app.get("/events", async (_req, res, next) => {
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
});

// Get single event (public)
app.get("/events/:id", async (req, res, next) => {
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
});

// ==================== PROTECTED ROUTES (STAFF) ====================

// Create event (staff only)
app.post("/events", requireAuth, requireStaff, async (req, res, next) => {
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
});

// Update event (staff only)
app.put("/events/:id", requireAuth, requireStaff, async (req, res, next) => {
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
});

// Delete event (staff only)
app.delete("/events/:id", requireAuth, requireStaff, async (req, res, next) => {
  try {
    await prisma.event.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// ==================== PROTECTED ROUTES (MEMBERS) ====================

// RSVP to event (authenticated users)
app.post("/events/:id/rsvp", requireAuth, async (req, res, next) => {
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
});

// Get user's RSVPs (authenticated users)
app.get("/me/rsvps", requireAuth, async (req, res, next) => {
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
});

// Error handling (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 API listening on :${port}`));
