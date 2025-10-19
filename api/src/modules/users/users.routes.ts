/*===============================================
 * Users Routes
 * ==============================================
 * Public routes for fetching user profiles and their events.
 * No authentication required - these are public profiles.
 * ==============================================
 */

import { Router } from "express";
import { getUserProfile, getUserEvents } from "./users.controller.js";

const router = Router();

// Public Routes
router.get("/:id", getUserProfile);
router.get("/:id/events", getUserEvents);

export default router;
