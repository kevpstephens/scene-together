/*===============================================
 * Date Utilities - AdminEventEditScreen
 * ==============================================
 * Date and time formatting for event editing.
 * ==============================================
 */

/**
 * Format date to readable format
 * @param date - Date object
 * @returns Formatted date (e.g., "Monday, December 25, 2024")
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format time to 12-hour format
 * @param date - Date object
 * @returns Formatted time (e.g., "7:30 PM")
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
