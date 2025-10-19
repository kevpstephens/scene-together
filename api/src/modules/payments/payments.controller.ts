import { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import * as stripeService from "./stripe.service.js";

/**
 * Create a payment intent for an event
 * POST /api/payments/create-intent
 */
export async function createPaymentIntent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { eventId, amount } = req.body;
    const userId = req.user!.id;

    // Validate event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if event requires payment
    if (!event.price && !event.payWhatYouCan) {
      return res.status(400).json({ error: "This event is free" });
    }

    // Determine amount to charge
    let chargeAmount: number;

    if (event.payWhatYouCan) {
      // Pay what you can - validate amount meets minimum
      if (!amount || amount < (event.minPrice || 0)) {
        return res.status(400).json({
          error: `Amount must be at least £${((event.minPrice || 0) / 100).toFixed(2)}`,
        });
      }
      chargeAmount = amount;
    } else if (event.price) {
      // Fixed price event
      chargeAmount = event.price;
    } else {
      return res.status(400).json({ error: "Event has no price configured" });
    }

    // Create payment intent
    const paymentIntent = await stripeService.createPaymentIntent({
      amount: chargeAmount,
      currency: "gbp",
      userId,
      eventId,
      eventTitle: event.title,
    });

    // Create payment record in database
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
 * POST /api/payments/webhook
 */
export async function handleWebhook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
      return res.status(400).json({ error: "No signature provided" });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return res.status(500).json({ error: "Webhook not configured" });
    }

    // Verify webhook signature
    const event = stripeService.constructWebhookEvent(
      req.body,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Ignore unexpected live-mode events in test environments for safety
    if (event.livemode && process.env.NODE_ENV !== "production") {
      console.warn(
        `Ignoring live-mode webhook event ${event.id} in ${process.env.NODE_ENV}`
      );
      return res.json({ ignored: true });
    }

    // Handle different event types
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
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Get payment history for a user
 * GET /api/payments/history
 */
export async function getPaymentHistory(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
 * Create a refund (admin only)
 * POST /api/payments/:paymentId/refund
 */
export async function createRefund(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    // Get payment record
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { event: true },
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    if (!payment.stripeId) {
      return res.status(400).json({ error: "No Stripe payment ID found" });
    }

    if (payment.status === "refunded") {
      return res.status(400).json({ error: "Payment already refunded" });
    }

    // Create refund in Stripe
    const refund = await stripeService.createRefund({
      paymentIntentId: payment.stripeId,
      amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents if provided
      reason: reason || "requested_by_customer",
    });

    // Update payment status
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "refunded" },
    });

    // Update RSVP status to not_going
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

// Helper functions

async function handlePaymentSuccess(paymentIntent: any) {
  const { userId, eventId } = paymentIntent.metadata;

  // Update payment status
  await prisma.payment.updateMany({
    where: {
      stripeId: paymentIntent.id,
    },
    data: {
      status: "succeeded",
    },
  });

  // Create or update RSVP to "going"
  await prisma.rSVP.upsert({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
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

async function handlePaymentFailure(paymentIntent: any) {
  // Update payment status
  await prisma.payment.updateMany({
    where: {
      stripeId: paymentIntent.id,
    },
    data: {
      status: "failed",
    },
  });

  console.log(`Payment failed for payment intent ${paymentIntent.id}`);
}

async function handleRefund(charge: any) {
  const paymentIntentId = charge.payment_intent;

  // Update payment status
  await prisma.payment.updateMany({
    where: {
      stripeId: paymentIntentId,
    },
    data: {
      status: "refunded",
    },
  });

  // Get the payment to find user and event
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
      data: {
        status: "not_going",
      },
    });
  }

  console.log(`Refund processed for payment intent ${paymentIntentId}`);
}
