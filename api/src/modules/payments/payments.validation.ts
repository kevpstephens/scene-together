/*===============================================
 * Payments Validation Schemas
 * ==============================================
 * Zod validation schemas for payment endpoints.
 * ==============================================
 */

import { z } from "zod";

/**
 * Validation schema for creating payment intent
 * POST /payments/create-intent
 */
export const createPaymentIntentSchema = z.object({
  body: z.object({
    eventId: z.string().uuid("Invalid event ID"),
    amount: z.number().int().positive("Amount must be positive").optional(), // Required for PWYC events
  }),
});

/**
 * Validation schema for creating refund
 * POST /payments/:paymentId/refund
 */
export const createRefundSchema = z.object({
  params: z.object({
    paymentId: z.string().uuid("Invalid payment ID"),
  }),
  body: z.object({
    amount: z.number().positive("Amount must be positive").optional(), // Optional for partial refunds
    reason: z
      .enum(["duplicate", "fraudulent", "requested_by_customer"])
      .optional(),
  }),
});

/**
 * Validation schema for syncing payment intent
 * POST /payments/sync-intent
 */
export const syncPaymentIntentSchema = z.object({
  body: z.object({
    paymentIntentId: z.string().min(1, "paymentIntentId is required"),
  }),
});
