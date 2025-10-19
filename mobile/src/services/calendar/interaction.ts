/**
 * User interaction for calendar operations
 * Handles alerts, prompts, and user feedback
 */

import { Alert, AlertButton } from "react-native";
import type { CalendarEventData } from "./creation";
import { openCalendarApp } from "./platformUtils";

/**
 * Show invalid date alert
 */
export function showInvalidDateAlert(): void {
  Alert.alert("Invalid Date", "Unable to add event: invalid date format.", [
    { text: "OK" },
  ]);
}

/**
 * Show calendar error alert
 * @param message - Custom error message
 */
export function showCalendarErrorAlert(message?: string): void {
  Alert.alert(
    "Calendar Error",
    message || "Unable to access your calendar. Please try again.",
    [{ text: "OK" }]
  );
}

/**
 * Show no calendars alert
 */
export function showNoCalendarsAlert(): void {
  Alert.alert("No Calendars", "No writable calendars found on your device.", [
    { text: "OK" },
  ]);
}

/**
 * Show event added success alert with option to open calendar
 * @param eventData - Event details
 * @param calendarName - Name of the calendar the event was added to
 */
export function showEventAddedAlert(
  eventData: CalendarEventData,
  calendarName: string
): void {
  Alert.alert(
    "✅ Added to Calendar",
    `"${eventData.title}" has been added to "${calendarName}".\n\n📅 ${eventData.startDate.toLocaleDateString()} at ${eventData.startDate.toLocaleTimeString()}\n\nOpen your Calendar app to view it.`,
    [
      { text: "OK", style: "default" },
      {
        text: "Open Calendar",
        onPress: () => openCalendarApp(eventData.startDate),
      },
    ]
  );
}

/**
 * Show calendar picker alert
 * Allows user to choose which calendar to add the event to
 * @param eventTitle - Title of the event to add
 * @param calendars - Array of calendar options with callbacks
 * @param onCancel - Callback when user cancels
 */
export function showCalendarPickerAlert(
  eventTitle: string,
  calendars: Array<{ text: string; onPress: () => void }>,
  onCancel: () => void
): void {
  const options: AlertButton[] = [
    ...calendars,
    {
      text: "Cancel",
      style: "cancel",
      onPress: onCancel,
    },
  ];

  Alert.alert(
    "Choose Calendar",
    `Where would you like to add "${eventTitle}"?`,
    options,
    { cancelable: true }
  );
}
