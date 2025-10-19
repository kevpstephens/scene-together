/*===============================================
 * Calendar Service - Public API
 * ==============================================
 * Clean barrel export for calendar operations.
 * Main functions: addEventToCalendar(), promptAddToCalendar()
 * ==============================================
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
