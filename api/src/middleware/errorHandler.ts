/*===============================================
 * Error Handling Middleware
 * ==============================================
 * Centralized error handling for Express API.
 * Provides consistent error responses and logging.
 * ==============================================
 */

import { Request, Response, NextFunction } from "express";

/**
 * Extended Error interface with HTTP status code
 * Allows controllers to throw errors with specific status codes
 */
export interface ApiError extends Error {
  statusCode?: number;
}

/**
 * Global error handler
 *
 * Catches all errors thrown or passed to next() in the request cycle.
 * Must be registered after all routes in server.ts.
 *
 * Features:
 * - Logs errors to console for debugging
 * - Returns consistent JSON error responses
 * - Includes stack trace in development mode only
 * - Defaults to 500 status code if not specified
 *
 * @example
 * // In a controller
 * throw new Error("Something went wrong"); // Returns 500
 *
 * const error = new Error("Not found") as ApiError;
 * error.statusCode = 404;
 * throw error; // Returns 404
 */
export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error details for debugging
  console.error("Error:", {
    message: err.message,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    error: message,
    // Include stack trace in development for easier debugging
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

/**
 * 404 Not Found handler
 *
 * Catches requests to undefined routes.
 * Must be registered after all routes but before errorHandler in server.ts.
 *
 * @example
 * // Request to /api/nonexistent
 * // Returns: { error: "Route not found", path: "/api/nonexistent" }
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
  });
}
