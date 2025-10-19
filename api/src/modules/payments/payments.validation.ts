import { z } from "zod";

export const createPaymentIntentSchema = z.object({
  body: z.object({
    eventId: z.string().uuid("Invalid event ID"),
    amount: z.number().int().positive("Amount must be positive").optional(),
  }),
});

export const createRefundSchema = z.object({
  params: z.object({
    paymentId: z.string().uuid("Invalid payment ID"),
  }),
  body: z.object({
    amount: z.number().positive("Amount must be positive").optional(),
    reason: z
      .enum(["duplicate", "fraudulent", "requested_by_customer"])
      .optional(),
  }),
});

export const syncPaymentIntentSchema = z.object({
  body: z.object({
    paymentIntentId: z.string().min(1, "paymentIntentId is required"),
  }),
});
