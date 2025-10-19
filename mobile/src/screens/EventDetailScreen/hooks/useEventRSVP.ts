/*===============================================
 * useEventRSVP Hook
 * ==============================================
 * Manages RSVP actions and calendar integration.
 * Handles RSVP creation, updates, cancellation,
 * and AsyncStorage caching for optimistic UI.
 * ==============================================
 */

import { useState } from "react";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { api } from "../../../services/api";
import { promptAddToCalendar } from "../../../services/calendar";
import { useToast } from "../../../contexts/toast";
import type { Event, RSVPStatus } from "../../../types";

interface UseEventRSVPProps {
  eventId: string;
  event: Event | null;
  userRSVP: RSVPStatus | null;
  setUserRSVP: (status: RSVPStatus | null) => void;
  loadEvent: () => Promise<void>;
  requestPayment: (amountCents: number, skipNotice?: boolean) => Promise<void>;
  requestPWYC: () => void;
  onRSVPSuccess: () => void;
}

/**
 * Custom hook for managing event RSVP actions
 * Handles RSVP creation, updates, and cancellation with calendar integration
 */
export const useEventRSVP = ({
  eventId,
  event,
  userRSVP,
  setUserRSVP,
  loadEvent,
  requestPayment,
  requestPWYC,
  onRSVPSuccess,
}: UseEventRSVPProps) => {
  const { showToast } = useToast();
  const [rsvpLoading, setRsvpLoading] = useState(false);

  /**
   * Handle RSVP action for an event
   */
  const handleRSVP = async (status: RSVPStatus) => {
    try {
      // Check if event has already started
      if (event && new Date(event.date).getTime() < new Date().getTime()) {
        Alert.alert(
          "Event Closed",
          "This event has already started and is no longer accepting RSVPs."
        );
        return;
      }

      // If going to a paid event, handle payment flow
      if (status === "going" && event) {
        const requiresPayment = event.price && event.price > 0;
        const isPWYC = event.payWhatYouCan === true;

        // Only handle payment flow if payment is required
        if (requiresPayment) {
          // Check for Expo Go before any payment flow
          if (Platform.OS !== "web" && Constants.appOwnership === "expo") {
            Alert.alert(
              "Payment Not Available",
              "Stripe payments require a development build and don't work in Expo Go.\n\nPlease build and run locally:\nnpx expo run:ios (iOS)\nnpx expo run:android (Android)",
              [{ text: "OK" }]
            );
            return;
          }

          // Pay What You Can: show demo modal first, then PWYC modal
          if (isPWYC) {
            requestPWYC();
            return;
          }

          // Fixed price event: process payment directly
          if (event.price) {
            await requestPayment(event.price);
            return;
          }
        }
      }

      setRsvpLoading(true);

      // Premium haptic feedback on tap (native only)
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      // Toggle logic: if clicking the same status, remove RSVP
      if (userRSVP === status) {
        await api.delete(`/events/${eventId}/rsvp`);

        // Update local state and clear cache
        setUserRSVP(null);
        await AsyncStorage.removeItem(`rsvp_${eventId}`);

        // Reload event to get updated attendee count
        await loadEvent();

        // Show success toast
        showToast("RSVP removed", "success");
      } else {
        // Create or update RSVP (free events only)
        await api.post(`/events/${eventId}/rsvp`, { status });

        // Update local state and cache
        setUserRSVP(status);
        await AsyncStorage.setItem(`rsvp_${eventId}`, status);

        // Reload event to get updated attendee count
        await loadEvent();

        // Show success toast
        const statusMessages = {
          going: "You're going! 🎉",
          interested: "Marked as interested ⭐",
          not_going: "RSVP removed",
        };
        showToast(statusMessages[status], "success");

        // Show confetti for "going" status
        if (status === "going") {
          onRSVPSuccess();
        }

        // If user is going, prompt to add to calendar
        if (status === "going" && event) {
          setTimeout(async () => {
            try {
              const startDate = new Date(event.date);

              // Validate the date is valid
              if (isNaN(startDate.getTime())) {
                console.error("Invalid event date:", event.date);
                showToast("Invalid event date", "error");
                return;
              }

              // Assume 3 hour duration (typical movie + socializing)
              const endDate = new Date(
                startDate.getTime() + 3 * 60 * 60 * 1000
              );

              const added = await promptAddToCalendar({
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

              if (added && Platform.OS !== "web") {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
              }
            } catch (error) {
              console.error("Error adding to calendar:", error);
            }
          }, 500);
        }
      }

      // Success haptic feedback (native only)
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error: any) {
      console.error("Failed to RSVP:", error);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      // Show error message from API or generic error
      if (error.response?.data?.error === "Event is at full capacity") {
        showToast("Event is full! 😔", "error");
      } else {
        showToast("Failed to RSVP. Please try again.", "error");
      }
    } finally {
      setRsvpLoading(false);
    }
  };

  return {
    rsvpLoading,
    handleRSVP,
  };
};
