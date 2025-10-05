import { Request, Response, NextFunction } from "express";

export interface ApiError extends Error {
  statusCode?: number;
}

/**
 * Global error handling middleware
 * Must be added after all routes
 */
export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

/**
 * 404 Not Found handler
 * Must be added after all routes but before error handler
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
}
