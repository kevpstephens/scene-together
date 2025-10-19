/**
 * Calendar selection logic
 * Handles getting and creating calendars on iOS and Android
 */

import * as Calendar from "expo-calendar";
import { Platform } from "react-native";

/**
 * Get the default calendar for the device
 * iOS: Returns the preferred writable calendar (iCloud > Default > any writable)
 * Android: Creates/returns a SceneTogether calendar
 * @returns Calendar ID or null if unavailable
 */
export async function getDefaultCalendar(): Promise<string | null> {
  try {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );

    console.log("📅 [getDefaultCalendar] Available calendars:");
    calendars.forEach((cal) => {
      console.log(
        `  - "${cal.title}" (ID: ${cal.id}, Source: ${cal.source.name}, Type: ${cal.source.type}, Writable: ${cal.allowsModifications})`
      );
    });

    if (Platform.OS === "ios") {
      return getIOSDefaultCalendar(calendars);
    } else {
      return getAndroidDefaultCalendar(calendars);
    }
  } catch (error) {
    console.error("❌ [getDefaultCalendar] Error:", error);
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
    console.log(
      `✅ [getDefaultCalendar] Using iOS calendar: "${defaultCalendar.title}" (${defaultCalendar.source.name})`
    );
    return defaultCalendar.id;
  }

  console.error("❌ [getDefaultCalendar] No writable iOS calendar found");
  return null;
}

/**
 * Get or create default calendar on Android
 * Creates a SceneTogether calendar if it doesn't exist
 */
async function getAndroidDefaultCalendar(
  calendars: Calendar.Calendar[]
): Promise<string | null> {
  // Look for existing SceneTogether calendar
  let sceneTogetherCalendar = calendars.find(
    (cal) => cal.title === "SceneTogether"
  );

  // If not found, create one
  if (!sceneTogetherCalendar) {
    console.log(
      "📅 [getDefaultCalendar] Creating SceneTogether calendar for Android..."
    );
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    const newCalendarId = await Calendar.createCalendarAsync({
      title: "SceneTogether",
      color: "#46D4AF",
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendar.source.id,
      source: defaultCalendar.source,
      name: "SceneTogether Events",
      ownerAccount: "personal",
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    console.log(
      `✅ [getDefaultCalendar] Created Android calendar with ID: ${newCalendarId}`
    );
    return newCalendarId;
  }

  console.log(
    `✅ [getDefaultCalendar] Using existing Android calendar: "${sceneTogetherCalendar.title}"`
  );
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
