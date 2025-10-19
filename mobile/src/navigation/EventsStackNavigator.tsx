import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EventsStackParamList } from "./types";
import EventsListScreen from "../screens/EventsListScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import { theme } from "../theme";
import { Platform, Image, View } from "react-native";

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
          backgroundColor: theme.colors.background,
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
          // Pure fade animation - lets our custom scale animation shine
          animation: "fade",
          presentation: "card",
          headerShown: true,
          animationDuration: 300,
          // Use native edge-pan for consistent behavior (works over WebViews)
          gestureEnabled: true,
          fullScreenGestureEnabled: false,
          // Use fade animation during swipe-back gesture
          animationMatchesGesture: true,
        }}
      />
    </Stack.Navigator>
  );
}
