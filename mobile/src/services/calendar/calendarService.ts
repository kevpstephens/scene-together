/*===============================================
 * Calendar Service
 * ==============================================
 * Orchestrates calendar operations across iOS, Android, and Web.
 * Handles permissions, calendar selection, event creation, and user prompts.
 * Modular design with platform-specific implementations.
 * ==============================================
 */

import type { CalendarEventData } from "./creation";
import { validateEventDates, createCalendarEvent } from "./creation";
import { requestCalendarPermissions } from "./permissions";
import {
  getDefaultCalendar,
  getCalendarName,
  getWritableCalendars,
} from "./selection";
import {
  showInvalidDateAlert,
  showCalendarErrorAlert,
  showNoCalendarsAlert,
  showEventAddedAlert,
  showCalendarPickerAlert,
} from "./interaction";

/**
 * Add an event to the device's default calendar
 * Automatically handles permissions and platform differences
 * @param eventData - Event details to add
 * @returns Event ID if successful, null otherwise
 */
export async function addEventToCalendar(
  eventData: CalendarEventData
): Promise<string | null> {
  try {
    // Validate dates
    if (!validateEventDates(eventData)) {
      showInvalidDateAlert();
      return null;
    }

    // Request permissions
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) {
      return null;
    }

    // Get default calendar
    const calendarId = await getDefaultCalendar();
    if (!calendarId) {
      showCalendarErrorAlert();
      return null;
    }

    // Create event
    const eventId = await createCalendarEvent(calendarId, eventData);
    if (!eventId) {
      showCalendarErrorAlert("Failed to create calendar event.");
      return null;
    }

    // Show success message
    const calendarName = await getCalendarName(calendarId);
    showEventAddedAlert(eventData, calendarName);

    return eventId;
  } catch (error) {
    console.error("Error adding event to calendar:", error);
    showCalendarErrorAlert("Failed to add event to calendar.");
    return null;
  }
}

/**
 * Prompt user to select a calendar and add event
 * Shows picker with all writable calendars on the device
 * @param eventData - Event details to add
 * @returns true if event was added, false otherwise
 */
export async function promptAddToCalendar(
  eventData: CalendarEventData
): Promise<boolean> {
  return new Promise(async (resolve) => {
    try {
      // Validate dates
      if (!validateEventDates(eventData)) {
        showInvalidDateAlert();
        resolve(false);
        return;
      }

      // Request permissions
      const hasPermission = await requestCalendarPermissions();
      if (!hasPermission) {
        resolve(false);
        return;
      }

      // Get available calendars
      const writableCalendars = await getWritableCalendars();

      if (writableCalendars.length === 0) {
        showNoCalendarsAlert();
        resolve(false);
        return;
      }

      // Create calendar options for user
      const calendarOptions = writableCalendars.map((cal) => ({
        text: `${cal.title} (${cal.source.name})`,
        onPress: async () => {
          const eventId = await createCalendarEvent(cal.id, eventData);
          if (eventId) {
            const calendarName = await getCalendarName(cal.id);
            showEventAddedAlert(eventData, calendarName);
            resolve(true);
          } else {
            showCalendarErrorAlert("Failed to create calendar event.");
            resolve(false);
          }
        },
      }));

      // Show calendar picker
      showCalendarPickerAlert(eventData.title, calendarOptions, () =>
        resolve(false)
      );
    } catch (error) {
      console.error("Error in promptAddToCalendar:", error);
      showCalendarErrorAlert("Failed to add event to calendar.");
      resolve(false);
    }
  });
}
