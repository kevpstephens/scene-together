/**
 * Calendar Service
 * Handles device calendar integration for adding events
 */

import * as Calendar from "expo-calendar";
import { Platform, Alert, Linking } from "react-native";

export interface CalendarEventData {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  notes?: string;
}

/**
 * Request calendar permissions from the user
 * Returns true if granted, false otherwise
 */
export async function requestCalendarPermissions(): Promise<boolean> {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Calendar access is needed to add events to your calendar. Please enable it in Settings.",
        [{ text: "OK" }]
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error requesting calendar permissions:", error);
    return false;
  }
}

/**
 * Get the default calendar for the device
 * iOS: Returns the default calendar
 * Android: Creates a new calendar if needed
 */
async function getDefaultCalendar(): Promise<string | null> {
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

    // iOS: Get the default calendar
    if (Platform.OS === "ios") {
      // Prefer iCloud calendar if available, otherwise any writable calendar
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

    // Android: Get or create a local calendar
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
  } catch (error) {
    console.error("❌ [getDefaultCalendar] Error:", error);
    return null;
  }
}

/**
 * Add an event to the device calendar using native UI
 * Opens the native calendar dialog so users can choose calendar and see details
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

    // Validate dates first
    if (
      !eventData.startDate ||
      !eventData.endDate ||
      isNaN(eventData.startDate.getTime()) ||
      isNaN(eventData.endDate.getTime())
    ) {
      console.error("❌ [Calendar Service] Invalid dates:", {
        startDate: eventData.startDate,
        endDate: eventData.endDate,
      });
      Alert.alert("Invalid Date", "Unable to add event: invalid date format.", [
        { text: "OK" },
      ]);
      return null;
    }

    console.log("📅 [Calendar Service] Requesting permissions...");
    // Request permissions
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) {
      console.log("❌ [Calendar Service] Permissions denied");
      return null;
    }
    console.log("✅ [Calendar Service] Permissions granted");

    // Create the event programmatically first
    console.log("📅 [Calendar Service] Getting default calendar...");
    const calendarId = await getDefaultCalendar();
    if (!calendarId) {
      console.error("❌ [Calendar Service] No calendar ID found");
      Alert.alert(
        "Calendar Error",
        "Unable to access your calendar. Please try again.",
        [{ text: "OK" }]
      );
      return null;
    }
    console.log("✅ [Calendar Service] Calendar ID:", calendarId);

    console.log("📅 [Calendar Service] Creating event...");
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
    console.log("✅ [Calendar Service] Event created with ID:", eventId);

    // Get the calendar name to show in the alert
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const usedCalendar = calendars.find((cal) => cal.id === calendarId);
    const calendarName = usedCalendar?.title || "your calendar";

    // Show a confirmation alert instead of trying to open calendar app
    // (Opening calendar app is unreliable on some devices)
    Alert.alert(
      "✅ Added to Calendar",
      `"${eventData.title}" has been added to "${calendarName}".\n\n📅 ${eventData.startDate.toLocaleDateString()} at ${eventData.startDate.toLocaleTimeString()}\n\nOpen your Calendar app to view it.`,
      [
        { text: "OK", style: "default" },
        {
          text: "Open Calendar",
          onPress: async () => {
            try {
              // Try to open the calendar app (works on some devices)
              if (Platform.OS === "ios") {
                await Linking.openURL("calshow://");
              } else {
                // Android
                await Linking.openURL("content://com.android.calendar/time/");
              }
            } catch (error) {
              console.log("Could not open calendar app:", error);
              // Silently fail - user can open calendar manually
            }
          },
        },
      ]
    );

    console.log("✅ [Calendar Service] Success! Returning event ID");
    return eventId;
  } catch (error) {
    console.error("Error adding event to calendar:", error);

    // If the native dialog isn't available (rare), fall back to programmatic creation
    if (error instanceof Error && error.message.includes("not available")) {
      return await fallbackCreateEvent(eventData);
    }

    Alert.alert(
      "Calendar Error",
      "Failed to open calendar. Please try again.",
      [{ text: "OK" }]
    );
    return null;
  }
}

/**
 * Fallback method: Create event programmatically if native dialog fails
 * This is only used as a last resort
 */
async function fallbackCreateEvent(
  eventData: CalendarEventData
): Promise<string | null> {
  try {
    const calendarId = await getDefaultCalendar();
    if (!calendarId) return null;

    const eventId = await Calendar.createEventAsync(calendarId, {
      title: eventData.title,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      location: eventData.location,
      notes: eventData.notes,
      timeZone: "GMT",
      alarms: [{ relativeOffset: -60 }, { relativeOffset: -1440 }],
    });

    return eventId;
  } catch (error) {
    console.error("Fallback calendar creation failed:", error);
    return null;
  }
}

/**
 * Helper function to add event to a specific calendar
 * Returns event ID if successful, null otherwise
 */
async function addEventToCalendarWithId(
  calendarId: string,
  eventData: CalendarEventData
): Promise<string | null> {
  try {
    console.log(
      `📅 [addEventToCalendarWithId] Adding to calendar ID: ${calendarId}`
    );

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

    console.log(
      "✅ [addEventToCalendarWithId] Event created with ID:",
      eventId
    );

    // Get the calendar name
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const usedCalendar = calendars.find((cal) => cal.id === calendarId);
    const calendarName = usedCalendar?.title || "your calendar";

    // Show success alert
    Alert.alert(
      "✅ Added to Calendar",
      `"${eventData.title}" has been added to "${calendarName}".\n\n📅 ${eventData.startDate.toLocaleDateString()} at ${eventData.startDate.toLocaleTimeString()}\n\nOpen your Calendar app to view it.`,
      [
        { text: "OK", style: "default" },
        {
          text: "Open Calendar",
          onPress: async () => {
            try {
              if (Platform.OS === "ios") {
                // Format date for URL schemes
                const eventDate = eventData.startDate;
                const dateString = eventDate.toISOString().split("T")[0]; // YYYY-MM-DD

                // Apple Calendar uses seconds since January 1, 2001 (not Unix epoch)
                const appleReferenceDate = new Date(
                  "2001-01-01T00:00:00Z"
                ).getTime();
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
              } else {
                // Android: Open to specific time
                const timestamp = eventData.startDate.getTime();
                await Linking.openURL(
                  `content://com.android.calendar/time/${timestamp}`
                );
              }
            } catch (error) {
              console.log("Could not open calendar app:", error);
            }
          },
        },
      ]
    );

    return eventId;
  } catch (error) {
    console.error("❌ [addEventToCalendarWithId] Error:", error);
    Alert.alert("Calendar Error", "Failed to add event to calendar.");
    return null;
  }
}

/**
 * Prompt user to add event to calendar with calendar selection
 * Returns true if event was added, false otherwise
 */
export async function promptAddToCalendar(
  eventData: CalendarEventData
): Promise<boolean> {
  console.log("📅 [promptAddToCalendar] Called with:", eventData.title);

  return new Promise(async (resolve) => {
    try {
      // Validate dates first
      if (
        !eventData.startDate ||
        !eventData.endDate ||
        isNaN(eventData.startDate.getTime()) ||
        isNaN(eventData.endDate.getTime())
      ) {
        console.error("❌ Invalid dates:", eventData);
        Alert.alert(
          "Invalid Date",
          "Unable to add event: invalid date format."
        );
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
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      const writableCalendars = calendars.filter(
        (cal) => cal.allowsModifications
      );

      console.log(`📅 Found ${writableCalendars.length} writable calendars`);

      if (writableCalendars.length === 0) {
        Alert.alert(
          "No Calendars",
          "No writable calendars found on your device."
        );
        resolve(false);
        return;
      }

      // Let user choose which calendar
      const calendarOptions = writableCalendars.map((cal) => ({
        text: `${cal.title} (${cal.source.name})`,
        onPress: async () => {
          const eventId = await addEventToCalendarWithId(cal.id, eventData);
          resolve(eventId !== null);
        },
      }));

      // Add cancel option
      calendarOptions.push({
        text: "Cancel",
        style: "cancel",
        onPress: () => {
          resolve(false);
        },
      } as any);

      // Show calendar picker
      Alert.alert(
        "Choose Calendar",
        `Where would you like to add "${eventData.title}"?`,
        calendarOptions,
        { cancelable: true }
      );
    } catch (error) {
      console.error("❌ Error in promptAddToCalendar:", error);
      Alert.alert("Error", "Failed to add event to calendar.");
      resolve(false);
    }
  });
}

/**
 * Check if calendar permissions are already granted
 */
export async function hasCalendarPermissions(): Promise<boolean> {
  try {
    const { status } = await Calendar.getCalendarPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error checking calendar permissions:", error);
    return false;
  }
}
