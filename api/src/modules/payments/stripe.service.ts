import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Use account default API version; set a fixed version here if desired
  typescript: true,
});

// Warn loudly if a live key is used outside production to prevent accidental charges
if (
  process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_") &&
  process.env.NODE_ENV !== "production"
) {
  console.warn(
    "⚠️ Using a LIVE Stripe secret key while NODE_ENV is not production. Switch to sk_test_... for demos."
  );
}

/**
 * Create a payment intent for an event RSVP
 */
export async function createPaymentIntent(params: {
  amount: number; // Amount in cents
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
 */
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

/**
 * Cancel a payment intent
 */
export async function cancelPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.cancel(paymentIntentId);
}

/**
 * Create a refund for a payment
 */
export async function createRefund(params: {
  paymentIntentId: string;
  amount?: number; // Optional partial refund amount in cents
  reason?: Stripe.RefundCreateParams.Reason;
}): Promise<Stripe.Refund> {
  const { paymentIntentId, amount, reason } = params;

  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount, // If undefined, refunds the full amount
    reason: reason || "requested_by_customer",
  });
}

/**
 * Verify Stripe webhook signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
