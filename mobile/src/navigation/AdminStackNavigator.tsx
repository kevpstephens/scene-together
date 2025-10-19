/*===============================================
 * Admin Stack Navigator
 * ==============================================
 * Navigation stack for admin functionality.
 * Contains dashboard, event management, and attendee screens.
 * Only accessible to users with ADMIN or SUPER_ADMIN role.
 * ==============================================
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdminStackParamList } from "./types";
import { theme } from "../theme";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminEventsScreen from "../screens/admin/AdminEventsScreen";
import AdminEventCreateScreen from "../screens/admin/AdminEventCreateScreen";
import AdminEventEditScreen from "../screens/admin/AdminEventEditScreen";
import AdminEventAttendeesScreen from "../screens/admin/AdminEventAttendeesScreen";

const Stack = createNativeStackNavigator<AdminStackParamList>();

/**
 * Admin Stack Navigator
 * Handles all admin-related screens
 */
export default function AdminStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: "600",
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          title: "Admin Dashboard",
          headerTintColor: theme.colors.primary,
        }}
      />
      <Stack.Screen
        name="AdminEvents"
        component={AdminEventsScreen}
        options={{ title: "Manage Events" }}
      />
      <Stack.Screen
        name="AdminEventCreate"
        component={AdminEventCreateScreen}
        options={{ title: "Create Event" }}
      />
      <Stack.Screen
        name="AdminEventEdit"
        component={AdminEventEditScreen}
        options={{ title: "Edit Event" }}
      />
      <Stack.Screen
        name="AdminEventAttendees"
        component={AdminEventAttendeesScreen}
        options={{ title: "Event Attendees" }}
      />
    </Stack.Navigator>
  );
}
