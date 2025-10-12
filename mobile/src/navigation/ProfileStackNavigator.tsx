import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "./types";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import { theme } from "../theme";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
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
        },
        // Premium spring-based animations
        animation: "default",
        animationDuration: 350,
        animationTypeForReplace: "push",
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "My Profile" }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{ title: "Edit Profile" }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{
          title: "Event Details",
          headerShown: true,
          animation: "fade",
          presentation: "card",
          animationDuration: 300,
        }}
      />
    </Stack.Navigator>
  );
}
