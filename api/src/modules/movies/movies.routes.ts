import { Router } from "express";
import * as moviesController from "./movies.controller.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.js";

const router = Router();

// All movie routes are admin-only (for creating events)
router.get("/search", requireAuth, requireAdmin, moviesController.searchMovies);

router.get(
  "/popular",
  requireAuth,
  requireAdmin,
  moviesController.getPopularMovies
);

router.get("/:id", requireAuth, requireAdmin, moviesController.getMovieDetails);

export default router;
