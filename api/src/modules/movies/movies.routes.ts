/*===============================================
 * Movies Routes
 * ==============================================
 * TMDb API endpoints for movie search and metadata.
 * All routes require ADMIN role (used when creating events).
 * ==============================================
 */

import { Router } from "express";
import * as moviesController from "./movies.controller.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.js";

const router = Router();

/**
 * GET /movies/search?query=...
 * Search TMDb for movies by title
 */
router.get("/search", requireAuth, requireAdmin, moviesController.searchMovies);

/**
 * GET /movies/popular
 * Get currently popular movies from TMDb
 */
router.get(
  "/popular",
  requireAuth,
  requireAdmin,
  moviesController.getPopularMovies
);

/**
 * GET /movies/:id
 * Get detailed movie information by TMDb ID
 */
router.get("/:id", requireAuth, requireAdmin, moviesController.getMovieDetails);

export default router;
