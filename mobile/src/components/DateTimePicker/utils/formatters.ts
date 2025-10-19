/*===============================================
 * Date/Time Formatters
 * ==============================================
 * Utility functions for formatting dates and times.
 * Used by DateTimePicker component.
 * ==============================================
 */

/**
 * Format date to readable string (e.g., "Mon, 23 Jan 2024")
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Format time to HH:MM format (e.g., "19:30")
 * @param date - Date to extract time from
 * @returns Formatted time string
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
