/*===============================================
 * Payments Routes
 * ==============================================
 * Stripe payment endpoints for event tickets.
 * Handles payment creation, sync, history, and refunds.
 *
 * Note: Webhook endpoint is mounted at server.ts level before express.json()
 * middleware to preserve raw body for signature verification.
 * ==============================================
 */

import { Router } from "express";
import * as paymentsController from "./payments.controller.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  createPaymentIntentSchema,
  createRefundSchema,
  syncPaymentIntentSchema,
} from "./payments.validation.js";

const router = Router();

/**
 * POST /payments/create-intent
 * Create Stripe payment intent for event ticket
 */
router.post(
  "/create-intent",
  requireAuth,
  validate(createPaymentIntentSchema),
  paymentsController.createPaymentIntent
);

/**
 * GET /payments/history
 * Get payment history for current user
 */
router.get("/history", requireAuth, paymentsController.getPaymentHistory);

/**
 * POST /payments/sync-intent
 * Manually sync payment status from Stripe (fallback for slow webhooks)
 */
router.post(
  "/sync-intent",
  requireAuth,
  validate(syncPaymentIntentSchema),
  paymentsController.syncPaymentIntent
);

/**
 * POST /payments/:paymentId/refund
 * Create refund (Admin only)
 */
router.post(
  "/:paymentId/refund",
  requireAuth,
  requireAdmin,
  validate(createRefundSchema),
  paymentsController.createRefund
);

export default router;
