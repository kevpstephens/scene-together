/*===============================================
 * Calendar Selection
 * ==============================================
 * Handles calendar discovery and selection across platforms.
 * iOS: Prefers iCloud > Default > any writable calendar
 * Android: Creates/uses a dedicated SceneTogether calendar
 * ==============================================
 */

import * as Calendar from "expo-calendar";
import { Platform } from "react-native";

/**
 * Get the default calendar for the device
 * Uses platform-specific logic to find the best calendar
 * @returns Calendar ID or null if unavailable
 */
export async function getDefaultCalendar(): Promise<string | null> {
  try {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );

    if (Platform.OS === "ios") {
      return getIOSDefaultCalendar(calendars);
    } else {
      return getAndroidDefaultCalendar(calendars);
    }
  } catch (error) {
    console.error("Error getting default calendar:", error);
    return null;
  }
}

/**
 * Get default calendar on iOS
 * Prefers iCloud, then Default, then any writable calendar
 */
async function getIOSDefaultCalendar(
  calendars: Calendar.Calendar[]
): Promise<string | null> {
  const defaultCalendar =
    calendars.find(
      (cal) => cal.source.name === "iCloud" && cal.allowsModifications
    ) ||
    calendars.find(
      (cal) => cal.source.name === "Default" && cal.allowsModifications
    ) ||
    calendars.find((cal) => cal.allowsModifications);

  if (defaultCalendar) {
    return defaultCalendar.id;
  }

  console.error("No writable iOS calendar found");
  return null;
}

/**
 * Get or create default calendar on Android
 * Creates a branded "SceneTogether" calendar if it doesn't exist
 */
async function getAndroidDefaultCalendar(
  calendars: Calendar.Calendar[]
): Promise<string | null> {
  // Look for existing SceneTogether calendar
  let sceneTogetherCalendar = calendars.find(
    (cal) => cal.title === "SceneTogether"
  );

  // If not found, create one with brand colors
  if (!sceneTogetherCalendar) {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    const newCalendarId = await Calendar.createCalendarAsync({
      title: "SceneTogether",
      color: "#46D4AF", // Brand primary color
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendar.source.id,
      source: defaultCalendar.source,
      name: "SceneTogether Events",
      ownerAccount: "personal",
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    return newCalendarId;
  }

  return sceneTogetherCalendar.id;
}

/**
 * Get all writable calendars available on the device
 * @returns Array of writable calendars
 */
export async function getWritableCalendars(): Promise<Calendar.Calendar[]> {
  try {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    return calendars.filter((cal) => cal.allowsModifications);
  } catch (error) {
    console.error("Error getting writable calendars:", error);
    return [];
  }
}

/**
 * Get calendar name by ID
 * @returns Calendar name or fallback string
 */
export async function getCalendarName(calendarId: string): Promise<string> {
  try {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const calendar = calendars.find((cal) => cal.id === calendarId);
    return calendar?.title || "your calendar";
  } catch (error) {
    console.error("Error getting calendar name:", error);
    return "your calendar";
  }
}
