/**
 * Main calendar service
 * Orchestrates all calendar operations using the modular components
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
 * Add an event to the device calendar
 * Uses the default calendar for the platform
 * @param eventData - Event details to add
 * @returns Event ID if successful, null otherwise
 */
export async function addEventToCalendar(
  eventData: CalendarEventData
): Promise<string | null> {
  try {
    console.log("📅 [Calendar Service] Starting addEventToCalendar");
    console.log("📅 [Calendar Service] Event data:", {
      title: eventData.title,
      startDate: eventData.startDate?.toISOString(),
      endDate: eventData.endDate?.toISOString(),
      location: eventData.location,
    });

    // Validate dates
    if (!validateEventDates(eventData)) {
      console.error("❌ [Calendar Service] Invalid dates:", {
        startDate: eventData.startDate,
        endDate: eventData.endDate,
      });
      showInvalidDateAlert();
      return null;
    }

    // Request permissions
    console.log("📅 [Calendar Service] Requesting permissions...");
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) {
      console.log("❌ [Calendar Service] Permissions denied");
      return null;
    }
    console.log("✅ [Calendar Service] Permissions granted");

    // Get default calendar
    console.log("📅 [Calendar Service] Getting default calendar...");
    const calendarId = await getDefaultCalendar();
    if (!calendarId) {
      console.error("❌ [Calendar Service] No calendar ID found");
      showCalendarErrorAlert();
      return null;
    }
    console.log("✅ [Calendar Service] Calendar ID:", calendarId);

    // Create event
    console.log("📅 [Calendar Service] Creating event...");
    const eventId = await createCalendarEvent(calendarId, eventData);
    if (!eventId) {
      showCalendarErrorAlert("Failed to create calendar event.");
      return null;
    }

    // Get calendar name and show success
    const calendarName = await getCalendarName(calendarId);
    showEventAddedAlert(eventData, calendarName);

    console.log("✅ [Calendar Service] Success! Returning event ID");
    return eventId;
  } catch (error) {
    console.error("Error adding event to calendar:", error);
    showCalendarErrorAlert("Failed to add event to calendar.");
    return null;
  }
}

/**
 * Prompt user to add event to calendar with calendar selection
 * Allows user to choose which calendar to use
 * @param eventData - Event details to add
 * @returns true if event was added, false otherwise
 */
export async function promptAddToCalendar(
  eventData: CalendarEventData
): Promise<boolean> {
  console.log("📅 [promptAddToCalendar] Called with:", eventData.title);

  return new Promise(async (resolve) => {
    try {
      // Validate dates
      if (!validateEventDates(eventData)) {
        console.error("❌ Invalid dates:", eventData);
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
      console.log(`📅 Found ${writableCalendars.length} writable calendars`);

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
      console.error("❌ Error in promptAddToCalendar:", error);
      showCalendarErrorAlert("Failed to add event to calendar.");
      resolve(false);
    }
  });
}
