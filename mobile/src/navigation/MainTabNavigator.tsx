import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  FilmIcon,
  UserIcon,
  Cog6ToothIcon,
} from "react-native-heroicons/outline";
import { MainTabParamList } from "./types";
import EventsStackNavigator from "./EventsStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import AdminStackNavigator from "./AdminStackNavigator";
import { theme } from "../theme";
import { useAuth } from "../contexts/AuthContext";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { isAdmin } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          paddingBottom: theme.spacing.md,
          paddingTop: theme.spacing.md,
          height: theme.layout.tabBarHeight,
          alignSelf: "center",
          width: "100%",
          maxWidth: theme.layout.maxWidth,
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.borderLight,
        },
        tabBarLabelStyle: {
          paddingBottom: theme.spacing.md,
        },
        animation: "shift",
        sceneStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
      screenListeners={{
        tabPress: () => {
          // Premium haptic feedback on tab switch (native only)
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        },
      }}
    >
      <Tab.Screen
        name="EventsTab"
        component={EventsStackNavigator}
        options={{
          tabBarLabel: "Events",
          tabBarIcon: ({ color }) => <FilmIcon size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => <UserIcon size={24} color={color} />,
        }}
      />
      {isAdmin && (
        <Tab.Screen
          name="AdminTab"
          component={AdminStackNavigator}
          options={{
            tabBarLabel: "Admin",
            tabBarIcon: ({ color }) => (
              <Cog6ToothIcon size={24} color={color} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}
