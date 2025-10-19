/*===============================================
 * Date Utilities - EventDetailScreen
 * ==============================================
 * Date and time formatting for event detail display.
 * ==============================================
 */

/**
 * Format date string to readable format
 * @param dateString - ISO date string
 * @returns Formatted date (e.g., "Monday, December 25, 2024")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format date string to readable time
 * @param dateString - ISO date string
 * @returns Formatted time (e.g., "7:30 PM")
 */
export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
