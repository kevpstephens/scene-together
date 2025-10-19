import { Router } from "express";
import * as eventsController from "./events.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  createEventSchema,
  updateEventSchema,
  getEventByIdSchema,
} from "./events.validation.js";

const router = Router();

// Public routes
router.get("/", eventsController.getAllEvents);

// Admin-only routes (must come before /:id to avoid matching "attendees" as an ID)
router.get(
  "/:id/attendees",
  requireAuth,
  requireAdmin,
  validate(getEventByIdSchema),
  eventsController.getEventAttendees
);

// Public route for single event (must come after specific routes)
router.get("/:id", validate(getEventByIdSchema), eventsController.getEventById);
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validate(createEventSchema),
  eventsController.createEvent
);
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validate(updateEventSchema),
  eventsController.updateEvent
);
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  validate(getEventByIdSchema),
  eventsController.deleteEvent
);

export default router;
