/*===============================================
 * RSVPs Routes
 * ==============================================
 * RSVP management endpoints for event attendance.
 * All routes require authentication.
 * ==============================================
 */

import { Router } from "express";
import * as rsvpsController from "./rsvps.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { createRSVPSchema } from "./rsvps.validation.js";

const router = Router();

/**
 * POST /events/:id/rsvp
 * Create or update RSVP for an event
 */
router.post(
  "/events/:id/rsvp",
  requireAuth,
  validate(createRSVPSchema),
  rsvpsController.createOrUpdateRSVP
);

/**
 * DELETE /events/:id/rsvp
 * Delete RSVP for an event
 */
router.delete("/events/:id/rsvp", requireAuth, rsvpsController.deleteRSVP);

/**
 * GET /me/rsvps
 * Get all RSVPs for current user
 */
router.get("/me/rsvps", requireAuth, rsvpsController.getUserRSVPs);

export default router;
