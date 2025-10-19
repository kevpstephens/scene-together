/*===============================================
 * Events Validation Schemas
 * ==============================================
 * Zod validation schemas for event endpoints.
 * Validates request body, params, and query strings.
 * ==============================================
 */

import { z } from "zod";

/**
 * Reusable movie metadata schema
 * Used in both create and update operations
 */
const movieDataSchema = z.object({
  title: z.string(),
  year: z.string().optional(),
  poster: z.string().optional(),
  plot: z.string().optional(),
  director: z.string().optional(),
  actors: z.string().optional(),
  runtime: z.string().optional(),
  genre: z.string().optional(),
  imdbRating: z.string().optional(),
  imdbId: z.string().optional(),
  trailer: z.string().optional(),
});

/**
 * Validation schema for creating an event
 * POST /events
 */
export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().optional(),
    date: z.string().datetime("Invalid date format"),
    location: z.string().optional(),
    onlineLink: z.string().url("Invalid URL").optional().or(z.literal("")),
    movieId: z.string().optional(),
    movieData: movieDataSchema.optional(),
    maxCapacity: z.number().int().positive().optional(),
    // Payment configuration
    price: z.number().int().nonnegative().nullable().optional(),
    payWhatYouCan: z.boolean().optional(),
    minPrice: z.number().int().nonnegative().nullable().optional(),
  }),
});

/**
 * Validation schema for updating an event
 * PUT /events/:id
 * All fields are optional (partial update)
 */
export const updateEventSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid event ID"),
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    date: z.string().datetime("Invalid date format").optional(),
    location: z.string().optional(),
    onlineLink: z.string().url("Invalid URL").optional().or(z.literal("")),
    movieId: z.string().optional(),
    movieData: movieDataSchema.optional(),
    maxCapacity: z.number().int().positive().optional(),
    // Payment configuration
    price: z.number().int().nonnegative().nullable().optional(),
    payWhatYouCan: z.boolean().optional(),
    minPrice: z.number().int().nonnegative().nullable().optional(),
  }),
});

/**
 * Validation schema for event ID parameter
 * Used in GET /events/:id, DELETE /events/:id, GET /events/:id/attendees
 */
export const getEventByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid event ID"),
  }),
});
