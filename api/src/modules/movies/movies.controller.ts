/*===============================================
 * Movies Controller
 * ==============================================
 * TMDb API integration for movie metadata.
 * All endpoints require ADMIN role (used when creating events).
 * ==============================================
 */

import { Request, Response, NextFunction } from "express";
import * as tmdbService from "./tmdb.service.js";

/**
 * Search for movies by title
 *
 * GET /movies/search?query=...&page=1
 *
 * Searches TMDb for movies matching the query.
 * Returns paginated results with posters and metadata.
 * Requires ADMIN or SUPER_ADMIN role.
 *
 * @param req.query.query - Search query (required)
 * @param req.query.page - Page number (optional, default: 1)
 * @returns Paginated search results
 */
export async function searchMovies(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { query, page } = req.query;

    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query parameter is required" });
      return;
    }

    const results = await tmdbService.searchMovies(
      query,
      page ? parseInt(page as string, 10) : 1
    );

    res.json(results);
  } catch (error) {
    next(error);
  }
}

/**
 * Get detailed movie information by TMDb ID
 *
 * GET /movies/:id
 *
 * Fetches complete movie metadata including cast, director, trailer, and ratings.
 * Requires ADMIN or SUPER_ADMIN role.
 *
 * @param req.params.id - TMDb movie ID
 * @returns Movie metadata object
 */
export async function getMovieDetails(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const movieData = await tmdbService.getMovieDetails(id);
    res.json(movieData);
  } catch (error) {
    next(error);
  }
}

/**
 * Get popular movies
 *
 * GET /movies/popular?page=1
 *
 * Fetches currently popular movies from TMDb.
 * Used for suggestions when creating events.
 * Requires ADMIN or SUPER_ADMIN role.
 *
 * @param req.query.page - Page number (optional, default: 1)
 * @returns Paginated list of popular movies
 */
export async function getPopularMovies(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { page } = req.query;
    const results = await tmdbService.getPopularMovies(
      page ? parseInt(page as string, 10) : 1
    );
    res.json(results);
  } catch (error) {
    next(error);
  }
}
