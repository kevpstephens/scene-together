import { z } from "zod";

/**
 * Validation schema for creating an event
 */
export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().optional(),
    date: z.string().datetime("Invalid date format"),
    location: z.string().optional(),
    onlineLink: z.string().url("Invalid URL").optional().or(z.literal("")),
    movieId: z.string().optional(),
    movieData: z
      .object({
        title: z.string(),
        year: z.string().optional(),
        poster: z.string().optional(),
        plot: z.string().optional(),
        director: z.string().optional(),
        actors: z.string().optional(),
        runtime: z.string().optional(),
        genre: z.string().optional(),
        imdbRating: z.string().optional(),
        trailer: z.string().optional(),
      })
      .optional(),
    maxCapacity: z.number().int().positive().optional(),
  }),
});

/**
 * Validation schema for updating an event
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
    movieData: z
      .object({
        title: z.string(),
        year: z.string().optional(),
        poster: z.string().optional(),
        plot: z.string().optional(),
        director: z.string().optional(),
        actors: z.string().optional(),
        runtime: z.string().optional(),
        genre: z.string().optional(),
        imdbRating: z.string().optional(),
        trailer: z.string().optional(),
      })
      .optional(),
    maxCapacity: z.number().int().positive().optional(),
  }),
});

/**
 * Validation schema for getting event by ID
 */
export const getEventByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid event ID"),
  }),
});
