import { Platform, Share } from "react-native";
import * as Haptics from "expo-haptics";
import { api } from "../../../services/api";
import { formatDate, formatTime } from "../utils";
import type { Event, RSVPStatus } from "../../../types";

interface UseEventActionsProps {
  userRSVPs: Record<string, RSVPStatus>;
  setUserRSVPs: React.Dispatch<
    React.SetStateAction<Record<string, RSVPStatus>>
  >;
  loadUserRSVPs: () => Promise<void>;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

interface UseEventActionsReturn {
  handleShare: (event: Event) => Promise<void>;
  handleBookmark: (event: Event) => Promise<void>;
}

/**
 * Custom hook for event actions (share, bookmark/RSVP)
 */
export const useEventActions = ({
  userRSVPs,
  setUserRSVPs,
  loadUserRSVPs,
  showToast,
}: UseEventActionsProps): UseEventActionsReturn => {
  /**
   * Share event details
   */
  const handleShare = async (event: Event) => {
    try {
      // Build share message
      let shareMessage = `${event.title}\n\n`;

      if (event.movieData?.title) {
        shareMessage += `Movie: ${event.movieData.title}\n`;
      }
      shareMessage += `📅 ${formatDate(event.date)} at ${formatTime(event.date)}\n`;
      shareMessage += `📍 ${event.location}\n`;

      if (event.price && event.price > 0) {
        if (event.payWhatYouCan) {
          shareMessage += `💰 Pay What You Can (min £${((event.minPrice || 0) / 100).toFixed(2)})\n`;
        } else {
          shareMessage += `💰 £${(event.price / 100).toFixed(2)}\n`;
        }
      } else {
        shareMessage += `🎟️ Free Event\n`;
      }

      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({
            title: event.title,
            text: shareMessage,
            url: window.location.href,
          });
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(shareMessage);
          alert("Event details copied to clipboard!");
        }
      } else {
        await Share.share({
          message: shareMessage,
          title: event.title,
        });

        // Haptic feedback on success
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error: any) {
      if (error.message !== "User did not share") {
        console.error("Share error:", error);
      }
    }
  };

  /**
   * Bookmark/unbookmark event (RSVP as "interested")
   */
  const handleBookmark = async (event: Event) => {
    try {
      // Haptic feedback on tap
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const currentStatus = userRSVPs[event.id];
      const isCurrentlyInterested = currentStatus === "interested";

      if (isCurrentlyInterested) {
        // Remove RSVP (unmark as interested)
        // Optimistically update UI by removing the entry
        setUserRSVPs((prev) => {
          const updated = { ...prev };
          delete updated[event.id];
          return updated;
        });

        // Make DELETE API call
        await api.delete(`/events/${event.id}/rsvp`);

        // Show success feedback
        showToast("Removed from interested", "success");
      } else {
        // Mark as interested
        // Optimistically update UI
        setUserRSVPs((prev) => ({
          ...prev,
          [event.id]: "interested",
        }));

        // Make POST API call
        await api.post(`/events/${event.id}/rsvp`, { status: "interested" });

        // Show success feedback
        showToast("⭐ Added to interested!", "success");
      }

      // Success haptic feedback
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Failed to update RSVP:", error);
      // Revert optimistic update
      await loadUserRSVPs();
      showToast("Failed to update. Please try again.", "error");
    }
  };

  return {
    handleShare,
    handleBookmark,
  };
};
