/*===============================================
 * Stripe Service
 * ==============================================
 * Stripe API integration for payment processing.
 * Handles payment intents, refunds, and webhook verification.
 * API Documentation: https://stripe.com/docs/api
 * ==============================================
 */

import Stripe from "stripe";

// ==================== Configuration ====================

// Validate Stripe secret key is configured
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

/**
 * Stripe client instance
 * Configured with TypeScript support
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

// Warn if live key is used in non-production environments
if (
  process.env.STRIPE_SECRET_KEY.startsWith("sk_live_") &&
  process.env.NODE_ENV !== "production"
) {
  console.warn(
    "⚠️  WARNING: Using LIVE Stripe key in non-production environment!"
  );
  console.warn("    Switch to sk_test_... to avoid real charges.");
}

// ==================== Service Functions ====================

/**
 * Create a payment intent for an event ticket
 *
 * Creates a Stripe PaymentIntent with automatic payment methods enabled.
 * Stores user/event metadata for webhook processing.
 *
 * @param params.amount - Amount in cents (e.g., 500 = £5.00)
 * @param params.currency - Currency code (e.g., "gbp")
 * @param params.userId - User UUID for metadata
 * @param params.eventId - Event UUID for metadata
 * @param params.eventTitle - Event title for metadata
 * @returns Created PaymentIntent with client secret
 */
export async function createPaymentIntent(params: {
  amount: number;
  currency: string;
  userId: string;
  eventId: string;
  eventTitle: string;
}): Promise<Stripe.PaymentIntent> {
  const { amount, currency, userId, eventId, eventTitle } = params;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata: {
      userId,
      eventId,
      eventTitle,
    },
    // Enable automatic payment methods (Apple Pay, Google Pay, etc.)
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

/**
 * Retrieve a payment intent by ID
 *
 * Used for manual status syncing when webhooks are slow/failed.
 *
 * @param paymentIntentId - Stripe PaymentIntent ID
 * @returns PaymentIntent object with current status
 */
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

/**
 * Cancel a payment intent
 *
 * Cancels a pending payment intent.
 * Can only cancel intents with status "requires_payment_method",
 * "requires_capture", "requires_confirmation", or "requires_action".
 *
 * @param paymentIntentId - Stripe PaymentIntent ID
 * @returns Cancelled PaymentIntent
 */
export async function cancelPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.cancel(paymentIntentId);
}

/**
 * Create a refund for a payment
 *
 * Issues a full or partial refund for a successful payment.
 * If amount is not specified, refunds the full payment amount.
 *
 * @param params.paymentIntentId - Stripe PaymentIntent ID
 * @param params.amount - Optional partial refund amount in cents
 * @param params.reason - Optional refund reason
 * @returns Created Refund object
 */
export async function createRefund(params: {
  paymentIntentId: string;
  amount?: number;
  reason?: Stripe.RefundCreateParams.Reason;
}): Promise<Stripe.Refund> {
  const { paymentIntentId, amount, reason } = params;

  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount, // If undefined, refunds full amount
    reason: reason || "requested_by_customer",
  });
}

/**
 * Verify Stripe webhook signature
 *
 * Validates webhook events are genuinely from Stripe.
 * CRITICAL: Must use raw body (not parsed JSON) for verification.
 *
 * @param payload - Raw request body (string or Buffer)
 * @param signature - Stripe-Signature header value
 * @param secret - Webhook secret from Stripe dashboard
 * @returns Verified Stripe Event object
 * @throws Error if signature verification fails
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
