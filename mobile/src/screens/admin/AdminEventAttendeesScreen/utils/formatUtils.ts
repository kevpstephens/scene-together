/*===============================================
 * Format Utilities - AdminEventAttendeesScreen
 * ==============================================
 * Formatting helpers for attendee display.
 * ==============================================
 */

import { theme } from "../../../../theme";

/**
 * Format date string to readable format with time
 * @param dateString - ISO date string
 * @returns Formatted date and time
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Get color for payment status
 * @param status - Payment status (CONFIRMED, PENDING, CANCELLED)
 * @returns Theme color code
 */
export const getStatusColor = (status: string): string => {
  switch (status.toUpperCase()) {
    case "CONFIRMED":
      return theme.colors.success;
    case "PENDING":
      return theme.colors.warning;
    case "CANCELLED":
      return theme.colors.error;
    default:
      return theme.colors.text.tertiary;
  }
};
