import { Request, Response, NextFunction } from "express";
import * as tmdbService from "./tmdb.service.js";

/**
 * Search for movies by title
 * Staff only (for creating events)
 */
export async function searchMovies(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { query, page } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required" });
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
 * Staff only (for creating events)
 */
export async function getMovieDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
 * Staff only (for suggestions when creating events)
 */
export async function getPopularMovies(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
