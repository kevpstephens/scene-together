/*===============================================
 * Calendar Permissions
 * ==============================================
 * Handles requesting and checking calendar access permissions.
 * Shows appropriate alerts when permissions are denied.
 * ==============================================
 */

import * as Calendar from "expo-calendar";
import { Alert } from "react-native";

/**
 * Request calendar permissions from the user
 * Shows alert if permissions are denied
 * @returns true if granted, false otherwise
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
 * Check if calendar permissions are already granted
 * @returns true if granted, false otherwise
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
