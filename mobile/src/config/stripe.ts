/**
 * Stripe Configuration
 *
 * Add EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env file
 * Get this key from your Stripe dashboard
 */

export const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_your_publishable_key_here";

if (!process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.warn(
    "⚠️  EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Payments will not work."
  );
}

