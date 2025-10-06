import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EventsStackParamList } from "./types";
import EventsListScreen from "../screens/EventsListScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import { theme } from "../theme";

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
      }}
    >
      <Stack.Screen
        name="EventsList"
        component={EventsListScreen}
        options={{ title: "SceneTogether" }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: "Event Details" }}
      />
    </Stack.Navigator>
  );
}
