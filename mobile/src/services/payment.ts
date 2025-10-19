/*===============================================
 * Payment Service
 * ==============================================
 * Handles Stripe payment operations including:
 * - Creating payment intents for event tickets
 * - Fetching payment history
 * - Manually syncing payment status (fallback for slow webhooks)
 * ==============================================
 */

import { api } from "./api";

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  status: "pending" | "succeeded" | "failed" | "refunded";
  createdAt: string;
  event: {
    id: string;
    title: string;
    date: string;
    movieData: any;
  };
}

/**
 * Create a Stripe payment intent for an event ticket
 * @param eventId - Event to purchase ticket for
 * @param amount - Optional custom amount in cents (for pay-what-you-can)
 */
export async function createPaymentIntent(
  eventId: string,
  amount?: number
): Promise<PaymentIntent> {
  const response = await api.post("/payments/create-intent", {
    eventId,
    amount,
  });
  return response.data;
}

/**
 * Fetch payment history for the current user
 */
export async function getPaymentHistory(): Promise<PaymentHistoryItem[]> {
  const response = await api.get("/payments/history");
  return response.data;
}

/**
 * Manually sync payment status from Stripe
 * Used as fallback when webhooks are delayed
 */
export async function syncPaymentIntent(
  paymentIntentId: string
): Promise<{ synced: boolean; status: string }> {
  const response = await api.post("/payments/sync-intent", { paymentIntentId });
  return response.data;
}
