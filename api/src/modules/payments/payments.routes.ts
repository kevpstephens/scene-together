import { Router } from "express";
import * as paymentsController from "./payments.controller.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  createPaymentIntentSchema,
  createRefundSchema,
  syncPaymentIntentSchema,
} from "./payments.validation.js";
import express from "express";

const router = Router();

/**
 * Create a payment intent for an event
 * @route POST /api/payments/create-intent
 * @access Private (requires authentication)
 */
router.post(
  "/create-intent",
  requireAuth,
  validate(createPaymentIntentSchema),
  paymentsController.createPaymentIntent
);

// Webhook is mounted at app-level before express.json() to preserve raw body

/**
 * Get payment history for current user
 * @route GET /api/payments/history
 * @access Private (requires authentication)
 */
router.get("/history", requireAuth, paymentsController.getPaymentHistory);

/**
 * Create a refund (admin only)
 * @route POST /api/payments/:paymentId/refund
 * @access Private (admin only)
 */
router.post(
  "/:paymentId/refund",
  requireAuth,
  requireAdmin,
  validate(createRefundSchema),
  paymentsController.createRefund
);

/**
 * Manually sync a PaymentIntent from Stripe and update local records
 * @route POST /api/payments/sync-intent
 * @access Private (requires authentication)
 */
router.post(
  "/sync-intent",
  requireAuth,
  validate(syncPaymentIntentSchema),
  paymentsController.syncPaymentIntent
);

export default router;
