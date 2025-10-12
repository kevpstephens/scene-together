import { Router } from "express";
import * as rsvpsController from "./rsvps.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { createRSVPSchema } from "./rsvps.validation.js";

const router = Router();

// All RSVP routes require authentication
router.post(
  "/events/:id/rsvp",
  requireAuth,
  validate(createRSVPSchema),
  rsvpsController.createOrUpdateRSVP
);
router.delete("/events/:id/rsvp", requireAuth, rsvpsController.deleteRSVP);
router.get("/me/rsvps", requireAuth, rsvpsController.getUserRSVPs);

export default router;
