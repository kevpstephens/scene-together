/**
 * Event creation logic
 * Handles creating calendar events with proper validation
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
 * Validate event dates
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
 * Create a calendar event programmatically
 * @param calendarId - ID of the calendar to add the event to
 * @param eventData - Event details
 * @returns Event ID if successful, null otherwise
 */
export async function createCalendarEvent(
  calendarId: string,
  eventData: CalendarEventData
): Promise<string | null> {
  try {
    console.log(`📅 Creating event in calendar ID: ${calendarId}`);

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

    console.log("✅ Event created with ID:", eventId);
    return eventId;
  } catch (error) {
    console.error("❌ Error creating event:", error);
    return null;
  }
}
