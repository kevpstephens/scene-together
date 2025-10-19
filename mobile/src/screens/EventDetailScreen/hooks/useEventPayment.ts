import { useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useStripe } from "../../../hooks/useStripe";
import { useToast } from "../../../contexts/toast";
import {
  createPaymentIntent,
  syncPaymentIntent,
} from "../../../services/payment";
import { promptAddToCalendar } from "../../../services/calendar";
import { STRIPE_PUBLISHABLE_KEY } from "../../../config/stripe";
import { api } from "../../../services/api";
import type { Event } from "../../../types";

interface UseEventPaymentProps {
  eventId: string;
  event: Event | null;
  demoNoticeSeen: boolean;
  loadEvent: () => Promise<void>;
  loadUserRSVP: () => Promise<void>;
  onPaymentSuccess: () => void;
}

/**
 * Custom hook for managing Stripe payment flow
 * Handles payment initialization, presentation, success, and test mode notices
 */
export const useEventPayment = ({
  eventId,
  event,
  demoNoticeSeen,
  loadEvent,
  loadUserRSVP,
  onPaymentSuccess,
}: UseEventPaymentProps) => {
  const { showToast } = useToast();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [showPWYCModal, setShowPWYCModal] = useState(false);
  const [pwycAmount, setPwycAmount] = useState("");
  const [showTestNotice, setShowTestNotice] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);

  const isTestMode =
    typeof STRIPE_PUBLISHABLE_KEY === "string" &&
    STRIPE_PUBLISHABLE_KEY.startsWith("pk_test_");

  /**
   * Wait for Stripe webhook to process and create RSVP
   * Polls the RSVP status with exponential backoff
   */
  const waitForWebhook = async (maxAttempts = 8) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Wait before checking (exponential backoff: 500ms, 1s, 2s, 4s...)
      const delay = Math.min(500 * Math.pow(2, attempt), 5000);
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Reload event and RSVP status
      await Promise.all([loadEvent(), loadUserRSVP()]);

      // Check if RSVP was created (webhook processed)
      // Note: loadUserRSVP updates the parent state, so we fetch fresh here
      try {
        const response = await api.get("/me/rsvps");
        const hasGoing =
          Array.isArray(response.data) &&
          response.data.find(
            (r: any) => r.eventId === eventId && r.status === "going"
          );
        if (hasGoing) {
          console.log(`✅ Webhook processed after ${attempt + 1} attempts`);
          return; // Success!
        }
      } catch (_error) {
        // RSVP doesn't exist yet, continue polling
      }
    }

    // If we get here, webhook may still be processing - reload one final time
    await Promise.all([loadEvent(), loadUserRSVP()]);
    console.warn("⚠️ Webhook polling timed out, RSVP may still be processing");
  };

  /**
   * Handle the complete payment flow with Stripe
   */
  const handlePayment = async (amount: number) => {
    try {
      setRsvpLoading(true);

      // Create payment intent on backend
      const {
        clientSecret,
        amount: chargedAmount,
        paymentIntentId,
      } = await createPaymentIntent(eventId, amount);

      // Initialize Stripe payment sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Scene Together",
        style: "automatic",
        googlePay: {
          merchantCountryCode: "GB",
          testEnv: __DEV__,
        },
        returnURL: "scenetogether://payment-complete",
      });

      if (initError) {
        console.error("Error initializing payment sheet:", initError);
        showToast("Failed to initialize payment", "error");
        return;
      }

      // Present payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === "Canceled") {
          showToast("Payment cancelled", "info");
        } else {
          console.error("Error presenting payment sheet:", presentError);
          showToast("Payment failed", "error");
        }
        return;
      }

      // Payment successful! Immediately show success feedback and continue background syncing
      showToast(
        `Payment successful! £${(chargedAmount / 100).toFixed(2)} paid 🎉`,
        "success"
      );
      onPaymentSuccess();

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Prompt to add to calendar (do not block)
      if (event) {
        setTimeout(async () => {
          try {
            const startDate = new Date(event.date);
            if (isNaN(startDate.getTime())) {
              console.error("Invalid event date");
              return;
            }

            // Assume 3 hour duration (typical movie + socializing)
            const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

            await promptAddToCalendar({
              title: event.title,
              startDate,
              endDate,
              location: event.location,
              notes: event.description
                ? `${event.description}\n\n${
                    event.movieData?.title
                      ? `Movie: ${event.movieData.title}`
                      : ""
                  }`
                : undefined,
            });
          } catch (error) {
            console.error("Calendar add error:", error);
          }
        }, 1000);
      }

      // Immediately sync payment status from Stripe and update UI
      (async () => {
        try {
          // Step 1: Force sync from Stripe immediately (don't wait for webhook)
          if (paymentIntentId) {
            console.log("🔄 Syncing payment intent from Stripe...");
            await syncPaymentIntent(paymentIntentId);
          }

          // Step 2: Quick check if RSVP exists (webhook may have created it)
          const meRsvps = await api.get("/me/rsvps");
          const hasGoing =
            Array.isArray(meRsvps.data) &&
            meRsvps.data.find(
              (r: any) => r.eventId === eventId && r.status === "going"
            );

          // Step 3: Create RSVP if it doesn't exist
          if (!hasGoing) {
            console.log("📝 Creating RSVP after payment...");
            await api.post(`/events/${eventId}/rsvp`, { status: "going" });
          }

          // Step 4: Cache the RSVP status immediately to prevent flash on future visits
          await AsyncStorage.setItem(`rsvp_${eventId}`, "going");

          // Step 5: Refresh event and RSVP data to update UI
          console.log("🔄 Refreshing event data...");
          await Promise.all([loadEvent(), loadUserRSVP()]);
          console.log("✅ Payment sync complete!");

          // Notify user that payment has been fully processed
          showToast("Payment confirmed! You're all set 🎉", "success");
        } catch (syncError) {
          console.error("❌ Background payment sync error:", syncError);
        }
      })();
    } catch (error: any) {
      console.error("Payment error:", error);
      showToast(error.message || "Payment failed", "error");
    } finally {
      setRsvpLoading(false);
      setShowPWYCModal(false);
      setPwycAmount("");
    }
  };

  /**
   * Wrapper that optionally shows a one-time test notice before running payment
   */
  const requestPayment = async (amountCents: number) => {
    if (isTestMode && !demoNoticeSeen) {
      setPendingAmount(amountCents);
      setShowTestNotice(true);
      return;
    }
    await handlePayment(amountCents);
  };

  /**
   * Handle dismissing the test notice modal
   */
  const handleDismissTestNotice = async () => {
    setShowTestNotice(false);
    if (dontShowAgain) {
      await AsyncStorage.setItem("demo_payment_notice_dismissed", "1");
    }
    if (pendingAmount !== null) {
      await handlePayment(pendingAmount);
      setPendingAmount(null);
    }
  };

  return {
    // State
    rsvpLoading,
    showPWYCModal,
    pwycAmount,
    showTestNotice,
    dontShowAgain,
    isTestMode,
    // Setters
    setShowPWYCModal,
    setPwycAmount,
    setDontShowAgain,
    setShowTestNotice,
    // Actions
    requestPayment,
    handlePayment,
    handleDismissTestNotice,
  };
};
