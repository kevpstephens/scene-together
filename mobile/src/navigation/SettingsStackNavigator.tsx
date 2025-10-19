/*===============================================
 * Settings Stack Navigator
 * ==============================================
 * Navigation stack for settings screen.
 * Provides consistent header styling.
 * ==============================================
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/SettingsScreen";
import { theme } from "../theme";

export type SettingsStackParamList = {
  SettingsMain: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeight.bold,
        },
        contentStyle: {
          maxWidth: theme.layout.maxWidth,
          alignSelf: "center",
          width: "100%",
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{
          title: "Settings",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
