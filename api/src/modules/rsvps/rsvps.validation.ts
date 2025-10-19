/*===============================================
 * RSVPs Validation Schemas
 * ==============================================
 * Zod validation schemas for RSVP endpoints.
 * ==============================================
 */

import { z } from "zod";

/**
 * Validation schema for creating/updating an RSVP
 * POST /events/:id/rsvp
 */
export const createRSVPSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid event ID"),
  }),
  body: z.object({
    status: z.enum(["going", "interested", "not_going"], {
      errorMap: () => ({
        message: "Status must be 'going', 'interested', or 'not_going'",
      }),
    }),
  }),
});
