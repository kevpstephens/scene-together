/*===============================================
 * Date Utilities - AdminEventsScreen
 * ==============================================
 * Date formatting and event status checks for admin event management.
 * ==============================================
 */

/**
 * Format date string to readable format with time
 * @param dateString - ISO date string
 * @returns Formatted date and time
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Check if event is in the past
 * @param dateString - ISO date string
 * @returns True if event date is before current time
 */
export const isPastEvent = (dateString: string): boolean => {
  return new Date(dateString) < new Date();
};
