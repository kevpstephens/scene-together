import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import authRouter from "./modules/auth/auth.routes.js";
import eventsRouter from "./modules/events/events.routes.js";
import rsvpsRouter from "./modules/rsvps/rsvps.routes.js";
import moviesRouter from "./modules/movies/movies.routes.js";
import paymentsRouter from "./modules/payments/payments.routes.js";
import * as paymentsController from "./modules/payments/payments.controller.js";
import expressRaw from "express";

const app = express();

// Middleware
app.use(cors());
// Mount Stripe webhook BEFORE express.json() so the body is raw
app.post(
  "/payments/webhook",
  expressRaw.raw({ type: "application/json" }),
  paymentsController.handleWebhook
);

// JSON parser for all other routes
app.use(express.json());
app.use(morgan("dev"));

// ==================== ROUTES ====================

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Feature modules
app.use("/auth", authRouter);
app.use("/events", eventsRouter);
app.use("/movies", moviesRouter);
app.use("/payments", paymentsRouter);
app.use("/", rsvpsRouter); // RSVPs routes include /events/:id/rsvp and /me/rsvps

// Error handling (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 API listening on :${port}`));
