import { Router } from "express";
import * as moviesController from "./movies.controller.js";
import { requireAuth, requireStaff } from "../../middleware/auth.js";

const router = Router();

// All movie routes are staff-only (for creating events)
router.get("/search", requireAuth, requireStaff, moviesController.searchMovies);

router.get(
  "/popular",
  requireAuth,
  requireStaff,
  moviesController.getPopularMovies
);

router.get("/:id", requireAuth, requireStaff, moviesController.getMovieDetails);

export default router;
