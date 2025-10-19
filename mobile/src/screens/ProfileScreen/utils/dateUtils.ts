/**
 * Date and time formatting utilities for profile screen
 */

/**
 * Formats a date string to a readable format
 * Example: "Mon, Dec 25"
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
 * Formats a date string to a readable time
 * Example: "7:30 PM"
 */
export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
