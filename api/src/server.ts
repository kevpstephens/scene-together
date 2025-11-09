/*===============================================
 * SceneTogether API Server
 * ==============================================
 * Express server for SceneTogether film screening events platform.
 *
 * Features:
 * - JWT authentication with Supabase
 * - TMDB API integration for movie data
 * - Stripe payment processing for event tickets
 * - RSVP management with capacity checking
 * - Role-based access control (USER, ADMIN, SUPER_ADMIN)
 *
 * Tech Stack:
 * - Express + TypeScript
 * - PostgreSQL with Prisma ORM
 * - Supabase Auth
 * - Stripe Payments
 * ==============================================
 */

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
import usersRouter from "./modules/users/users.routes.js";
import * as paymentsController from "./modules/payments/payments.controller.js";

const app = express();

// ==================== Global Middleware ====================

// CORS - Allow cross-origin requests from frontend
app.use(cors());

// CRITICAL: Stripe webhook must come BEFORE express.json()
// Webhook signature verification requires raw body, not parsed JSON
app.post(
  "/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentsController.handleWebhook
);

// JSON parser for all other routes
app.use(express.json());

// HTTP request logging (development only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ==================== Routes ====================

/**
 * Health check endpoint
 * GET /health
 */
app.get("/health", (_req, res) => res.json({ ok: true, service: "api" }));

/**
 * Auth routes - User authentication and profile management
 * GET  /auth/me       - Get current user
 * PATCH /auth/me      - Update profile
 */
app.use("/auth", authRouter);

/**
 * Events routes - Event CRUD and attendee management
 * GET    /events             - List all events (public)
 * GET    /events/:id         - Get event details (public)
 * POST   /events             - Create event (admin)
 * PUT    /events/:id         - Update event (admin)
 * DELETE /events/:id         - Delete event (admin)
 * GET    /events/:id/attendees - View attendees (admin)
 */
app.use("/events", eventsRouter);

/**
 * Movies routes - TMDB API integration
 * GET /movies/search     - Search movies (admin)
 * GET /movies/popular    - Get popular movies (admin)
 * GET /movies/:id        - Get movie details (admin)
 */
app.use("/movies", moviesRouter);

/**
 * Payments routes - Stripe integration
 * POST /payments/create-intent    - Create payment intent (authenticated)
 * POST /payments/sync-intent      - Sync payment status (authenticated)
 * GET  /payments/history          - Get payment history (authenticated)
 * POST /payments/:id/refund       - Issue refund (admin)
 * POST /payments/webhook          - Stripe webhook (public, verified)
 */
app.use("/payments", paymentsRouter);

/**
 * RSVPs routes - Event attendance management
 * POST   /events/:id/rsvp    - Create/update RSVP (authenticated)
 * DELETE /events/:id/rsvp    - Delete RSVP (authenticated)
 * GET    /me/rsvps           - Get user's RSVPs (authenticated)
 */
app.use("/", rsvpsRouter);

/**
 * Users routes - User profile and events
 * GET /users/:id         - Get user profile (public)
 * GET /users/:id/events  - Get user's created events (public)
 */
app.use("/users", usersRouter);

// ==================== Error Handling ====================

// 404 handler - catches undefined routes
app.use(notFoundHandler);

// Global error handler - catches all errors
app.use(errorHandler);

// ==================== Server Startup ====================

const port = parseInt(process.env.PORT || "4000", 10);
const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

app.listen(port, host, () => {
  console.log(`🚀 SceneTogether API`);
  console.log(`📍 http://${host}:${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
