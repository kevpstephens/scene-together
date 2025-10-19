/*===============================================
 * useEventActions Hook
 * ==============================================
 * Manages event-related actions like sharing and external links.
 * Handles platform-specific sharing (Web Share API vs native) and
 * calendar actions (native Calendar vs web ICS/Google link).
 * ==============================================
 */

import { Alert, Platform, Linking, Share } from "react-native";
import * as Haptics from "expo-haptics";
import { useToast } from "../../../contexts/toast";
import { promptAddToCalendar } from "../../../services/calendar";
import type { Event } from "../../../types";
// Web calendar helpers (no-ops on native)
import {
  buildGoogleCalendarUrl,
  createIcsFromEvent,
  downloadIcs,
} from "../../../services/calendar/webCalendar";

interface UseEventActionsProps {
  event: Event | null;
  onSuccess: () => void;
}

/**
 * Custom hook for managing event actions
 * Handles sharing, calendar integration, and external links (IMDB)
 */
export const useEventActions = ({ event, onSuccess }: UseEventActionsProps) => {
  const { showToast } = useToast();

  /**
   * Handle sharing event details
   * Platform-specific: Web Share API or native Share
   */
  const handleShare = async () => {
    if (!event) return;

    try {
      // Haptic feedback (native only)
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Format event details for sharing
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = eventDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      // Build share message
      let shareMessage = `${event.title}\n\n`;

      if (event.movieData?.title) {
        shareMessage += `Movie: ${event.movieData.title}\n`;
      }

      shareMessage += `Date: ${formattedDate}\n`;
      shareMessage += `Time: ${formattedTime}\n`;

      if (event.location) {
        shareMessage += `Location: ${event.location}\n`;
      }

      if (event.description) {
        shareMessage += `\n${event.description}\n`;
      }

      shareMessage += `\nJoin us at SceneTogether! 🍿`;

      // For web, use Web Share API if available, otherwise copy to clipboard
      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({
            title: event.title,
            text: shareMessage,
            url: window.location.href,
          });
          showToast("Shared successfully! 🎉", "success");
        } else {
          // Fallback: Copy to clipboard
          await navigator.clipboard.writeText(shareMessage);
          showToast("Event details copied to clipboard! 📋", "success");
        }
      } else {
        // Native sharing - use React Native's Share API
        const result = await Share.share({
          message: shareMessage,
          title: event.title,
        });

        if (result.action === Share.sharedAction) {
          showToast("Shared successfully! 🎉", "success");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error: any) {
      console.error("Error sharing event:", error);

      // Don't show error if user cancelled
      if (
        error?.message !== "User cancelled" &&
        error?.code !== "ERR_CANCELED"
      ) {
        showToast("Failed to share event", "error");
      }
    }
  };

  /**
   * Open IMDB page for the movie
   */
  const handleOpenIMDB = async () => {
    if (!event?.movieData?.imdbId) {
      Alert.alert("No IMDB", "IMDB link not available for this film");
      return;
    }

    const imdbUrl = `https://www.imdb.com/title/${event.movieData.imdbId}`;

    try {
      const supported = await Linking.canOpenURL(imdbUrl);
      if (supported) {
        await Linking.openURL(imdbUrl);
      } else {
        Alert.alert("Error", "Cannot open IMDB URL");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open IMDB");
    }
  };

  /**
   * Add event to calendar (native) or provide web alternatives (Google/ICS)
   */
  const handleAddToCalendar = async () => {
    if (!event) return;

    try {
      // Haptic feedback (native only)
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const startDate = new Date(event.date);

      // Validate the date
      if (isNaN(startDate.getTime())) {
        showToast("Invalid event date", "error");
        return;
      }

      // Assume 3 hour duration (typical movie + socializing)
      const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

      if (Platform.OS === "web") {
        // Web: Offer Google Calendar link and ICS download
        const webEvent = {
          id: event.id,
          title: event.title,
          description: event.description || undefined,
          location: event.location || undefined,
          startUtcISO: startDate.toISOString(),
          endUtcISO: endDate.toISOString(),
        };

        // Download ICS
        const ics = createIcsFromEvent(webEvent);
        downloadIcs(`${event.title}`.replace(/\s+/g, "-").toLowerCase(), ics);

        // Open Google Calendar in a new tab
        const gcalUrl = buildGoogleCalendarUrl(webEvent);
        window.open(gcalUrl, "_blank");
        showToast("ICS downloaded and Google Calendar opened", "success");
        return;
      }

      // Native: use device calendar
      const added = await promptAddToCalendar({
        title: event.title,
        startDate,
        endDate,
        location: event.location,
        notes: event.description
          ? `${event.description}\n\n${
              event.movieData?.title ? `Movie: ${event.movieData.title}` : ""
            }`
          : undefined,
      });

      if (added) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Show confetti on successful calendar add
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding to calendar:", error);
      showToast("Failed to add to calendar", "error");
    }
  };

  return {
    handleShare,
    handleOpenIMDB,
    handleAddToCalendar,
  };
};
