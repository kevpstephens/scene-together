/*===============================================
 * TMDb Service
 * ==============================================
 * The Movie Database (TMDb) API integration.
 * Handles movie search, details fetching, and metadata extraction.
 * API Documentation: https://developers.themoviedb.org/3
 * ==============================================
 */

import axios from "axios";
import type { MovieData } from "../../types/index.js";

// ==================== Configuration ====================

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// ==================== Type Definitions ====================

/**
 * TMDb API response for movie search and popular movies
 */
interface TMDbMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  genre_ids: number[];
}

/**
 * TMDb API response for detailed movie information
 * Includes credits, videos, and external IDs when appended
 */
interface TMDbMovieDetails {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
  credits?: {
    cast: { name: string }[];
    crew: { name: string; job: string }[];
  };
  videos?: {
    results: { key: string; site: string; type: string }[];
  };
  external_ids?: {
    imdb_id: string | null;
  };
}

// ==================== Service Functions ====================

/**
 * Search for movies by title
 *
 * Searches TMDb for movies matching the query string.
 * Returns simplified movie data with posters in w500 resolution.
 *
 * @param query - Search query string
 * @param page - Page number for pagination (default: 1)
 * @returns Paginated search results with movie metadata
 * @throws Error if API key is missing or API call fails
 */
export async function searchMovies(query: string, page = 1) {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is not configured in environment variables");
    throw new Error(
      "Movie search is temporarily unavailable. Please contact an administrator."
    );
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page,
        language: "en-US",
      },
    });

    return {
      results: response.data.results.map((movie: TMDbMovie) => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date?.split("-")[0] || "",
        poster: movie.poster_path
          ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
          : null,
        plot: movie.overview,
        rating: movie.vote_average.toString(),
      })),
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };
  } catch (error: unknown) {
    const err = error as any;
    console.error("TMDb search error:", err.response?.data || err.message);

    // Handle specific HTTP errors
    if (err.response?.status === 401) {
      throw new Error("Movie search authentication failed. Invalid API key.");
    }
    if (err.response?.status === 429) {
      throw new Error(
        "Movie search rate limit exceeded. Please try again in a moment."
      );
    }

    // Handle network errors
    if (err.code === "ENOTFOUND" || err.code === "ETIMEDOUT") {
      throw new Error(
        "Unable to connect to movie database. Please check your internet connection."
      );
    }

    throw new Error("Failed to search movies. Please try again.");
  }
}

/**
 * Get detailed movie information by TMDb ID
 *
 * Fetches comprehensive movie metadata including:
 * - Basic info (title, year, plot, runtime, genres)
 * - Cast and crew (top 3 actors, director)
 * - Media (poster, YouTube trailer)
 * - External IDs (IMDb ID)
 *
 * Uses TMDb's append_to_response feature to fetch all data in one request.
 *
 * @param tmdbId - TMDb movie ID
 * @returns MovieData object compatible with event.movieData schema
 * @throws Error if API key is missing, movie not found, or API call fails
 */
export async function getMovieDetails(tmdbId: string): Promise<MovieData> {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is not configured in environment variables");
    throw new Error(
      "Movie details are temporarily unavailable. Please contact an administrator."
    );
  }

  try {
    // Fetch movie with appended credits, videos, and external IDs
    const response = await axios.get<TMDbMovieDetails>(
      `${TMDB_BASE_URL}/movie/${tmdbId}`,
      {
        params: {
          api_key: TMDB_API_KEY,
          append_to_response: "credits,videos,external_ids",
          language: "en-US",
        },
      }
    );

    const movie = response.data;

    // Extract director from crew
    const director = movie.credits?.crew.find((c) => c.job === "Director");

    // Get top 3 actors
    const actors = movie.credits?.cast
      .slice(0, 3)
      .map((c) => c.name)
      .join(", ");

    // Find first YouTube trailer
    const trailer = movie.videos?.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    );

    // Transform TMDb data to our MovieData format
    return {
      title: movie.title,
      year: movie.release_date?.split("-")[0] || "",
      poster: movie.poster_path
        ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
        : undefined,
      plot: movie.overview || undefined,
      director: director?.name,
      actors: actors || undefined,
      runtime: movie.runtime ? `${movie.runtime} min` : undefined,
      genre: movie.genres.map((g) => g.name).join(", "),
      imdbRating: movie.vote_average.toString(),
      imdbId: movie.external_ids?.imdb_id || undefined,
      trailer: trailer
        ? `https://www.youtube.com/watch?v=${trailer.key}`
        : undefined,
    };
  } catch (error: unknown) {
    const err = error as any;
    console.error("TMDb details error:", err.response?.data || err.message);

    // Handle specific HTTP errors
    if (err.response?.status === 401) {
      throw new Error("Movie details authentication failed. Invalid API key.");
    }
    if (err.response?.status === 404) {
      throw new Error(
        "Movie not found. The movie may have been removed from the database."
      );
    }
    if (err.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }

    // Handle network errors
    if (err.code === "ENOTFOUND" || err.code === "ETIMEDOUT") {
      throw new Error(
        "Unable to connect to movie database. Please check your internet connection."
      );
    }

    throw new Error("Failed to fetch movie details. Please try again.");
  }
}

/**
 * Get popular movies
 *
 * Fetches currently popular/trending movies from TMDb.
 * Used to provide suggestions when admins create events.
 * Returns simplified movie data with posters in w500 resolution.
 *
 * @param page - Page number for pagination (default: 1)
 * @returns Paginated list of popular movies
 * @throws Error if API key is missing or API call fails
 */
export async function getPopularMovies(page = 1) {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is not configured in environment variables");
    throw new Error(
      "Popular movies are temporarily unavailable. Please contact an administrator."
    );
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        page,
        language: "en-US",
      },
    });

    return {
      results: response.data.results.map((movie: TMDbMovie) => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date?.split("-")[0] || "",
        poster: movie.poster_path
          ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
          : null,
        plot: movie.overview,
        rating: movie.vote_average.toString(),
      })),
      page: response.data.page,
      totalPages: response.data.total_pages,
    };
  } catch (error: unknown) {
    const err = error as any;
    console.error(
      "TMDb popular movies error:",
      err.response?.data || err.message
    );

    // Handle specific HTTP errors
    if (err.response?.status === 401) {
      throw new Error("Popular movies authentication failed. Invalid API key.");
    }
    if (err.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }

    // Handle network errors
    if (err.code === "ENOTFOUND" || err.code === "ETIMEDOUT") {
      throw new Error(
        "Unable to connect to movie database. Please check your internet connection."
      );
    }

    throw new Error("Failed to fetch popular movies. Please try again.");
  }
}
