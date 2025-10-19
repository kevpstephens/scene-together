/**
 * Date and time formatting utilities for event list
 */

/**
 * Format event date for display (TODAY, TOMORROW, or formatted date)
 */
export const formatDate = (dateString: string): string => {
  const eventDate = new Date(dateString);
  const now = new Date();

  // Strip time for accurate day comparison
  const eventDateOnly = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate()
  );
  const todayDateOnly = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  // Calculate difference in days
  const diffTime = eventDateOnly.getTime() - todayDateOnly.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Only show special labels for TODAY and TOMORROW
  if (diffDays === 0) return "TODAY";
  if (diffDays === 1) return "TOMORROW";

  // For all other dates, show formatted date
  return eventDate
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    .toUpperCase();
};

/**
 * Format event time for display (12-hour format)
 */
export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
