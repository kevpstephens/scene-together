// Default/fallback export for TypeScript
// The actual implementation will be platform-specific (.native.ts or .web.ts)
export function useStripe() {
  return {
    initPaymentSheet: async () => ({ error: null }),
    presentPaymentSheet: async () => ({
      error: {
        code: "Unavailable",
        message: "Payments not supported on this platform",
      },
    }),
  };
}



