/**
 * Calendar Service
 * Handles device calendar integration for adding events
 *
 * This is the main export file that provides a clean API for calendar operations
 */

// Export types
export type { CalendarEventData } from "./creation";

// Export main functions
export { addEventToCalendar, promptAddToCalendar } from "./calendarService";

// Export utility functions for advanced usage
export {
  requestCalendarPermissions,
  hasCalendarPermissions,
} from "./permissions";
export { getDefaultCalendar, getWritableCalendars } from "./selection";
