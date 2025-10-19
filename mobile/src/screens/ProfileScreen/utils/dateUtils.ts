/*===============================================
 * Date Utilities - ProfileScreen
 * ==============================================
 * Date and time formatting for profile event display.
 * ==============================================
 */

/**
 * Format date string to readable format
 * @param dateString - ISO date string
 * @returns Formatted date (e.g., "Mon, Dec 25")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
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
