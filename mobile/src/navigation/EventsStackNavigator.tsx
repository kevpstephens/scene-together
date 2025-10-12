import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EventsStackParamList } from "./types";
import EventsListScreen from "../screens/EventsListScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import { theme } from "../theme";
import { Platform } from "react-native";

const Stack = createNativeStackNavigator<EventsStackParamList>();

export default function EventsStackNavigator() {
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
        animation: Platform.OS === "ios" ? "default" : "slide_from_right",
        animationDuration: 350,
        animationTypeForReplace: "push",
        // Gesture configuration for iOS
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="EventsList"
        component={EventsListScreen}
        options={{
          title: "SceneTogether",
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{
          title: "Event Details",
          // Pure fade animation - lets our custom scale animation shine
          animation: "fade",
          presentation: "card",
          headerShown: true,
          animationDuration: 300,
        }}
      />
    </Stack.Navigator>
  );
}
