import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import eventsRouter from "./modules/events/events.routes.js";
import rsvpsRouter from "./modules/rsvps/rsvps.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ==================== ROUTES ====================

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Feature modules
app.use("/events", eventsRouter);
app.use("/", rsvpsRouter); // RSVPs routes include /events/:id/rsvp and /me/rsvps

// Error handling (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 API listening on :${port}`));
