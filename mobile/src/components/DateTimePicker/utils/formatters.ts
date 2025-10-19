/**
 * Format date to a readable string
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
 * Format time to HH:MM format
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
