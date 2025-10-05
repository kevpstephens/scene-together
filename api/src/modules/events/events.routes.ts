import { Router } from "express";
import * as eventsController from "./events.controller";
import { requireAuth, requireStaff } from "../../middleware/auth.js";
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

// Staff-only routes
router.post(
  "/",
  requireAuth,
  requireStaff,
  validate(createEventSchema),
  eventsController.createEvent
);
router.put(
  "/:id",
  requireAuth,
  requireStaff,
  validate(updateEventSchema),
  eventsController.updateEvent
);
router.delete(
  "/:id",
  requireAuth,
  requireStaff,
  validate(getEventByIdSchema),
  eventsController.deleteEvent
);

export default router;
