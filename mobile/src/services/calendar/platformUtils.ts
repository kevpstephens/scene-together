/**
 * Platform-specific utilities for calendar operations
 * Handles iOS and Android differences
 */

import { Platform, Linking } from "react-native";

/**
 * Open the native calendar app
 * Tries multiple calendar apps on iOS, uses default on Android
 */
export async function openCalendarApp(eventDate?: Date): Promise<void> {
  try {
    if (Platform.OS === "ios") {
      await openIOSCalendarApp(eventDate);
    } else {
      await openAndroidCalendarApp(eventDate);
    }
  } catch (error) {
    console.log("Could not open calendar app:", error);
    // Silently fail - user can open calendar manually
  }
}

/**
 * Open calendar app on iOS
 * Tries multiple popular calendar apps with deep links
 */
async function openIOSCalendarApp(eventDate?: Date): Promise<void> {
  if (!eventDate) {
    // Open without specific date
    await Linking.openURL("calshow://");
    return;
  }

  // Format date for URL schemes
  const dateString = eventDate.toISOString().split("T")[0]; // YYYY-MM-DD

  // Apple Calendar uses seconds since January 1, 2001 (not Unix epoch)
  const appleReferenceDate = new Date("2001-01-01T00:00:00Z").getTime();
  const appleTimestamp = Math.floor(
    (eventDate.getTime() - appleReferenceDate) / 1000
  );

  // Try calendar apps with deep links to the event date
  const calendarApps = [
    {
      url: `x-fantastical3://show?date=${dateString}`,
      name: "Fantastical 3",
    },
    {
      url: `fantastical2://show?date=${dateString}`,
      name: "Fantastical 2",
    },
    {
      url: `googlecalendar://`,
      name: "Google Calendar",
    },
    {
      url: `calshow:${appleTimestamp}`,
      name: "Apple Calendar",
    },
  ];

  let opened = false;
  for (const app of calendarApps) {
    const canOpen = await Linking.canOpenURL(app.url);
    if (canOpen) {
      await Linking.openURL(app.url);
      opened = true;
      console.log(`✅ Opened ${app.name} to date: ${dateString}`);
      break;
    }
  }

  if (!opened) {
    console.log("⚠️ No calendar app could be opened");
  }
}

/**
 * Open calendar app on Android
 * Opens to specific event time if provided
 */
async function openAndroidCalendarApp(eventDate?: Date): Promise<void> {
  if (eventDate) {
    const timestamp = eventDate.getTime();
    await Linking.openURL(`content://com.android.calendar/time/${timestamp}`);
  } else {
    await Linking.openURL("content://com.android.calendar/time/");
  }
}
