/*===============================================
 * Validation Middleware
 * ==============================================
 * Zod-based request validation for Express routes.
 * Validates body, query, and params before reaching controllers.
 * ==============================================
 */

import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

/**
 * Validate incoming request data against a Zod schema
 *
 * Validates request body, query params, and URL params.
 * Returns 400 with detailed error messages on validation failure.
 *
 * @param schema - Zod schema object defining validation rules
 *
 * @example
 * // In a validation file
 * const createEventSchema = z.object({
 *   body: z.object({
 *     title: z.string().min(1),
 *     date: z.string().datetime(),
 *   }),
 *   params: z.object({
 *     id: z.string().uuid(),
 *   }),
 * });
 *
 * // In routes
 * router.post('/events', validate(createEventSchema), createEvent);
 *
 * @returns Express middleware function
 */
export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate all parts of the request
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Validation passed - continue to controller
      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation failed",
          details: error.errors.map((err) => ({
            path: err.path.join("."), // e.g., "body.title"
            message: err.message,
          })),
        });
        return;
      }

      // Pass unexpected errors to global error handler
      next(error);
    }
  };
