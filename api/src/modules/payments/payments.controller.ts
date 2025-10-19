/*===============================================
 * Payments Controller
 * ==============================================
 * Stripe payment integration for event tickets.
 * Handles payment intents, webhooks, history, and refunds.
 * ==============================================
 */

import { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import * as stripeService from "./stripe.service.js";

// ==================== Public Endpoints ====================

/**
 * Create a payment intent for an event
 *
 * POST /payments/create-intent
 *
 * Creates a Stripe PaymentIntent and database payment record.
 * Supports fixed-price and pay-what-you-can events.
 * Requires authentication.
 *
 * @param req.body.eventId - Event UUID
 * @param req.body.amount - Amount in cents (required for PWYC events)
 * @returns Client secret for Stripe payment flow
 */
export async function createPaymentIntent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { eventId, amount } = req.body;
    const userId = req.user!.id;

    // Validate event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    // Validate event requires payment
    if (!event.price && !event.payWhatYouCan) {
      res.status(400).json({ error: "This event is free" });
      return;
    }

    // Determine amount to charge
    let chargeAmount: number;

    if (event.payWhatYouCan) {
      // Pay what you can - validate amount meets minimum
      const minPrice = event.minPrice || 0;
      if (!amount || amount < minPrice) {
        res.status(400).json({
          error: `Amount must be at least £${(minPrice / 100).toFixed(2)}`,
        });
        return;
      }
      chargeAmount = amount;
    } else if (event.price) {
      // Fixed price event
      chargeAmount = event.price;
    } else {
      res.status(400).json({ error: "Event has no price configured" });
      return;
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripeService.createPaymentIntent({
      amount: chargeAmount,
      currency: "gbp",
      userId,
      eventId,
      eventTitle: event.title,
    });

    // Create payment record in database (pending status)
    await prisma.payment.create({
      data: {
        userId,
        eventId,
        amount: chargeAmount,
        status: "pending",
        stripeId: paymentIntent.id,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: chargeAmount,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    next(error);
  }
}

/**
 * Handle Stripe webhook events
 *
 * POST /payments/webhook
 *
 * Receives and processes webhook events from Stripe.
 * Verifies signature for security, then updates payment/RSVP status.
 *
 * Handled events:
 * - payment_intent.succeeded: Updates payment to "succeeded", creates RSVP
 * - payment_intent.payment_failed: Updates payment to "failed"
 * - charge.refunded: Updates payment to "refunded", RSVP to "not_going"
 *
 * @param req.body - Raw webhook payload (must be raw for signature verification)
 * @param req.headers.stripe-signature - Stripe signature header
 * @returns Success acknowledgment
 */
export async function handleWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
      res.status(400).json({ error: "No signature provided" });
      return;
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      res.status(500).json({ error: "Webhook not configured" });
      return;
    }

    // Verify webhook signature for security
    const event = stripeService.constructWebhookEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Ignore live-mode events in non-production environments for safety
    if (event.livemode && process.env.NODE_ENV !== "production") {
      console.warn(
        `Ignoring live-mode webhook event ${event.id} in ${process.env.NODE_ENV}`
      );
      res.json({ ignored: true });
      return;
    }

    // Process event based on type
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as any;
        await handlePaymentSuccess(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any;
        await handlePaymentFailure(paymentIntent);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as any;
        await handleRefund(charge);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: unknown) {
    const err = error as any;
    console.error("Webhook error:", err.message);
    res.status(400).json({ error: err.message });
  }
}

/**
 * Get payment history for current user
 *
 * GET /payments/history
 *
 * Returns all payments for the authenticated user.
 * Includes event details (title, date, movieData).
 * Ordered by most recent first.
 * Requires authentication.
 *
 * @returns Array of payments with event details
 */
export async function getPaymentHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;

    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            movieData: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(payments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    next(error);
  }
}

/**
 * Manually sync payment intent status from Stripe
 *
 * POST /payments/sync-intent
 *
 * Client-side fallback for slow/failed webhooks.
 * Fetches current PaymentIntent status from Stripe and updates local records.
 * If payment succeeded, creates/updates RSVP to "going".
 * Requires authentication.
 *
 * @param req.body.paymentIntentId - Stripe PaymentIntent ID
 * @returns Sync status and current payment status
 */
export async function syncPaymentIntent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { paymentIntentId } = req.body as { paymentIntentId: string };

    if (!paymentIntentId) {
      res.status(400).json({ error: "paymentIntentId is required" });
      return;
    }

    // Fetch current status from Stripe
    const intent = await stripeService.getPaymentIntent(paymentIntentId);

    // Update local payment record
    await prisma.payment.updateMany({
      where: { stripeId: paymentIntentId },
      data: {
        status:
          intent.status === "succeeded" ? "succeeded" : (intent.status as any),
      },
    });

    // If payment succeeded, ensure RSVP is created/updated
    if (intent.status === "succeeded") {
      const { userId, eventId } = intent.metadata as any;
      if (userId && eventId) {
        await prisma.rSVP.upsert({
          where: { userId_eventId: { userId, eventId } },
          update: { status: "going" },
          create: { userId, eventId, status: "going" },
        });
      }
    }

    res.json({ synced: true, status: intent.status });
  } catch (error) {
    console.error("Error syncing payment intent:", error);
    next(error);
  }
}

// ==================== Admin Endpoints ====================

/**
 * Create a refund for a payment
 *
 * POST /payments/:paymentId/refund
 *
 * Issues a refund through Stripe and updates local records.
 * Updates payment status to "refunded" and RSVP to "not_going".
 * Requires ADMIN or SUPER_ADMIN role.
 *
 * @param req.params.paymentId - Payment UUID
 * @param req.body.amount - Optional partial refund amount (in pounds, not cents)
 * @param req.body.reason - Optional refund reason
 * @returns Refund details
 */
export async function createRefund(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    // Get payment record
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { event: true },
    });

    if (!payment) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }

    if (!payment.stripeId) {
      res.status(400).json({ error: "No Stripe payment ID found" });
      return;
    }

    if (payment.status === "refunded") {
      res.status(400).json({ error: "Payment already refunded" });
      return;
    }

    // Create refund in Stripe
    const refund = await stripeService.createRefund({
      paymentIntentId: payment.stripeId,
      amount: amount ? Math.round(amount * 100) : undefined, // Convert pounds to cents
      reason: reason || "requested_by_customer",
    });

    // Update payment status to refunded
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "refunded" },
    });

    // Update RSVP to not_going
    await prisma.rSVP.updateMany({
      where: {
        userId: payment.userId,
        eventId: payment.eventId,
      },
      data: { status: "not_going" },
    });

    res.json({
      message: "Refund created successfully",
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
      },
    });
  } catch (error) {
    console.error("Error creating refund:", error);
    next(error);
  }
}

// ==================== Webhook Helper Functions ====================

/**
 * Handle successful payment from webhook
 * Updates payment status to "succeeded" and creates/updates RSVP to "going"
 */
async function handlePaymentSuccess(paymentIntent: any): Promise<void> {
  const { userId, eventId } = paymentIntent.metadata;

  // Update payment status
  await prisma.payment.updateMany({
    where: { stripeId: paymentIntent.id },
    data: { status: "succeeded" },
  });

  // Create or update RSVP to "going"
  await prisma.rSVP.upsert({
    where: {
      userId_eventId: { userId, eventId },
    },
    create: {
      userId,
      eventId,
      status: "going",
    },
    update: {
      status: "going",
    },
  });

  console.log(`Payment succeeded for user ${userId} and event ${eventId}`);
}

/**
 * Handle failed payment from webhook
 * Updates payment status to "failed"
 */
async function handlePaymentFailure(paymentIntent: any): Promise<void> {
  await prisma.payment.updateMany({
    where: { stripeId: paymentIntent.id },
    data: { status: "failed" },
  });

  console.log(`Payment failed for payment intent ${paymentIntent.id}`);
}

/**
 * Handle refund from webhook
 * Updates payment status to "refunded" and RSVP to "not_going"
 */
async function handleRefund(charge: any): Promise<void> {
  const paymentIntentId = charge.payment_intent;

  // Update payment status
  await prisma.payment.updateMany({
    where: { stripeId: paymentIntentId },
    data: { status: "refunded" },
  });

  // Get payment to find associated user and event
  const payment = await prisma.payment.findFirst({
    where: { stripeId: paymentIntentId },
  });

  if (payment) {
    // Update RSVP to not_going
    await prisma.rSVP.updateMany({
      where: {
        userId: payment.userId,
        eventId: payment.eventId,
      },
      data: { status: "not_going" },
    });
  }

  console.log(`Refund processed for payment intent ${paymentIntentId}`);
}
