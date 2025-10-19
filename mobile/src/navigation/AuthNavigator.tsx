/*===============================================
 * Auth Navigator
 * ==============================================
 * Navigation stack for unauthenticated users.
 * Contains Login and SignUp screens.
 * ==============================================
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./types";
import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import { theme } from "../theme";

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * Auth Stack Navigator
 * Handles login and signup flow
 */
export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
