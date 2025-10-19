/*===============================================
 * Event Utilities - EventsListScreen
 * ==============================================
 * Business logic for event status, filtering, and pricing.
 * ==============================================
 */

import { theme } from "../../../theme";
import type { Event } from "../../../types";

/**
 * Calculate event status based on capacity
 * @param event - Event object
 * @returns Status object or null if no capacity set
 */
export const getEventStatus = (
  event: Event
): { type: string; label: string } | null => {
  // Check if event is in the past
  const eventDate = new Date(event.date);
  const now = new Date();
  if (eventDate.getTime() < now.getTime()) {
    return { type: "past", label: "Past Event" };
  }

  if (!event.maxCapacity) return null;

  const currentAttendees = event.attendeeCount || 0;
  const percentageFull = (currentAttendees / event.maxCapacity) * 100;

  // Granular capacity-based statuses
  if (currentAttendees >= event.maxCapacity) {
    return { type: "soldOut", label: "Sold Out" };
  } else if (percentageFull >= 90) {
    return { type: "almostFull", label: "Almost Full" };
  } else if (percentageFull >= 70) {
    return { type: "nearlyFull", label: "Nearly Full" };
  } else if (percentageFull >= 50) {
    return { type: "fillingUp", label: "Filling Up" };
  } else if (percentageFull >= 30) {
    return { type: "available", label: "Available" };
  } else {
    return { type: "plentySpace", label: "Plenty of Space" };
  }
};

/**
 * Get event time status for filtering
 * @param event - Event object
 * @returns Time status: "upcoming", "ongoing", or "past"
 */
export const getEventTimeStatus = (
  event: Event
): "upcoming" | "ongoing" | "past" => {
  const eventDate = new Date(event.date);
  const now = new Date();

  if (eventDate.getTime() < now.getTime()) return "past";

  // Check if event is today (but hasn't started yet)
  const isToday =
    eventDate.getDate() === now.getDate() &&
    eventDate.getMonth() === now.getMonth() &&
    eventDate.getFullYear() === now.getFullYear();

  if (isToday) return "ongoing"; // "Today" filter

  return "upcoming";
};

/**
 * Format price for display with appropriate label and color
 * @param event - Event object
 * @returns Price display object or null if no price
 */
export const formatPrice = (
  event: Event
): { label: string; color: string } | null => {
  if (!event.price || event.price === 0) {
    return { label: "FREE", color: theme.colors.success };
  }

  const priceInPounds = (event.price / 100).toFixed(2);

  if (event.payWhatYouCan) {
    if (event.minPrice && event.minPrice > 0) {
      const minInPounds = (event.minPrice / 100).toFixed(2);
      return {
        label: `£${minInPounds}+ PWYC`,
        color: theme.colors.accent,
      };
    }
    return {
      label: `£${priceInPounds}+ PWYC`,
      color: theme.colors.accent,
    };
  }

  return { label: `£${priceInPounds}`, color: theme.colors.primary };
};
