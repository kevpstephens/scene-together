/*===============================================
 * Events Stack Navigator
 * ==============================================
 * Navigation stack for events flow.
 * Contains EventsList and EventDetail screens.
 * Features custom logo header and optimized animations.
 * ==============================================
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EventsStackParamList } from "./types";
import EventsListScreen from "../screens/EventsListScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { theme } from "../theme";
import { Platform, Image, View } from "react-native";

const Stack = createNativeStackNavigator<EventsStackParamList>();

/**
 * Events Stack Navigator
 * Handles event browsing and detail views
 */
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
          backgroundColor: theme.colors.background,
        },
        animation: Platform.OS === "ios" ? "default" : "slide_from_right",
        animationDuration: 350,
        animationTypeForReplace: "push",
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="EventsList"
        component={EventsListScreen}
        options={{
          headerTitle: () => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                ...(Platform.OS === "web" && {
                  width: "100%",
                  position: "absolute",
                  left: 0,
                  right: 0,
                }),
              }}
            >
              <Image
                source={require("../../assets/logo/logo-transparent.png")}
                style={{ width: 200, height: 50 }}
                resizeMode="contain"
              />
            </View>
          ),
          animation: "fade",
          ...(Platform.OS === "web" && {
            headerTitleAlign: "center",
          }),
        }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{
          title: "Event Details",
          // Fade animation for smooth transition with custom scale animation
          animation: "fade",
          presentation: "card",
          headerShown: true,
          animationDuration: 300,
          gestureEnabled: true,
          fullScreenGestureEnabled: false,
          animationMatchesGesture: true,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          animation: "slide_from_right",
          presentation: "card",
          headerShown: true,
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}
