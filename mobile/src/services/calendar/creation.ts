/*===============================================
 * Calendar Event Creation
 * ==============================================
 * Handles creating calendar events with validation and default reminders.
 * Sets up 1-hour and 1-day advance notifications.
 * ==============================================
 */

import * as Calendar from "expo-calendar";

export interface CalendarEventData {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  notes?: string;
}

/**
 * Validate that event dates are valid Date objects
 * @returns true if dates are valid, false otherwise
 */
export function validateEventDates(eventData: CalendarEventData): boolean {
  return !!(
    eventData.startDate &&
    eventData.endDate &&
    !isNaN(eventData.startDate.getTime()) &&
    !isNaN(eventData.endDate.getTime())
  );
}

/**
 * Create a calendar event with automatic reminders
 * @param calendarId - ID of the calendar to add the event to
 * @param eventData - Event details
 * @returns Event ID if successful, null otherwise
 */
export async function createCalendarEvent(
  calendarId: string,
  eventData: CalendarEventData
): Promise<string | null> {
  try {
    const eventId = await Calendar.createEventAsync(calendarId, {
      title: eventData.title,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      location: eventData.location,
      notes: eventData.notes,
      timeZone: "GMT",
      alarms: [
        { relativeOffset: -60 }, // 1 hour before
        { relativeOffset: -1440 }, // 1 day before
      ],
    });

    return eventId;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return null;
  }
}
