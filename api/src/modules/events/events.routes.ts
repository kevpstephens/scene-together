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
router.get("/:id", validate(getEventByIdSchema), eventsController.getEventById);

// Admin-only routes
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
