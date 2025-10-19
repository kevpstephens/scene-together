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
 * Create a payment intent for an event
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
 * Get payment history for current user
 */
export async function getPaymentHistory(): Promise<PaymentHistoryItem[]> {
  const response = await api.get("/payments/history");
  return response.data;
}

