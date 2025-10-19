/*===============================================
 * Events Routes
 * ==============================================
 * Event management endpoints.
 * Public: GET /events, GET /events/:id
 * Admin: POST, PUT, DELETE /events, GET /events/:id/attendees
 *
 * IMPORTANT: Order matters!
 * - Specific routes (/:id/attendees) must come BEFORE generic routes (/:id)
 * - This prevents "attendees" from being matched as an event ID
 * ==============================================
 */

import { Router } from "express";
import * as eventsController from "./events.controller.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  createEventSchema,
  updateEventSchema,
  getEventByIdSchema,
} from "./events.validation.js";

const router = Router();

// ==================== Public Routes ====================

/**
 * GET /events
 * Get all events with attendee counts
 */
router.get("/", eventsController.getAllEvents);

// ==================== Admin Routes ====================
// Note: These must come before /:id to avoid path matching issues

/**
 * GET /events/:id/attendees
 * Get all RSVPs for an event (Admin only)
 */
router.get(
  "/:id/attendees",
  requireAuth,
  requireAdmin,
  validate(getEventByIdSchema),
  eventsController.getEventAttendees
);

/**
 * POST /events
 * Create new event (Admin only)
 */
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validate(createEventSchema),
  eventsController.createEvent
);

/**
 * PUT /events/:id
 * Update existing event (Admin only)
 */
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validate(updateEventSchema),
  eventsController.updateEvent
);

/**
 * DELETE /events/:id
 * Delete event (Admin only)
 */
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  validate(getEventByIdSchema),
  eventsController.deleteEvent
);

// ==================== Public Routes (Continued) ====================
// Note: This must come after specific routes to avoid matching issues

/**
 * GET /events/:id
 * Get single event by ID
 */
router.get("/:id", validate(getEventByIdSchema), eventsController.getEventById);

export default router;
