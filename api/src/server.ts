import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

// list events (public)
app.get("/events", async (_req, res) => {
  const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
  res.json(events);
});

// (staff) create event - minimal skeleton (auth/role check to add later)
app.post("/events", async (req, res) => {
  const { title, description, date, location, onlineLink, movieId } = req.body;
  const event = await prisma.event.create({
    data: {
      title,
      description,
      date: new Date(date),
      location,
      onlineLink,
      movieId,
    },
  });
  res.status(201).json(event);
});

// (member) RSVP
app.post("/events/:id/rsvp", async (req, res) => {
  const { userId, status } = req.body; // later derive from auth
  const { id: eventId } = req.params;
  const rsvp = await prisma.rSVP.upsert({
    where: { userId_eventId: { userId, eventId } },
    update: { status },
    create: { userId, eventId, status },
  });
  res.status(201).json(rsvp);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
