/*===============================================
 * Calendar Platform Utilities
 * ==============================================
 * Platform-specific utilities for opening native calendar apps.
 * iOS: Deep links to popular calendar apps (Fantastical, Google, Apple)
 * Android: Uses content:// URI scheme
 * ==============================================
 */

import { Platform, Linking } from "react-native";

/**
 * Open the native calendar app on the user's device
 * Attempts to open to a specific date if provided
 * @param eventDate - Optional date to navigate to
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
 * Open calendar app on iOS using deep links
 * Tries multiple popular calendar apps in order of preference
 */
async function openIOSCalendarApp(eventDate?: Date): Promise<void> {
  if (!eventDate) {
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

  // Try each app until one opens successfully
  for (const app of calendarApps) {
    const canOpen = await Linking.canOpenURL(app.url);
    if (canOpen) {
      await Linking.openURL(app.url);
      break;
    }
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
