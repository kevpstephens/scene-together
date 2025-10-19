// Web version - mock Stripe functions
export function useStripe() {
  return {
    initPaymentSheet: async (_params?: any) => ({ error: null }),
    presentPaymentSheet: async () => ({
      error: {
        code: "Unavailable",
        message: "Payments not supported on web yet",
      },
    }),
  };
}
