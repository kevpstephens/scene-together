import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FilmIcon, UserIcon } from "react-native-heroicons/outline";
import { MainTabParamList } from "./types";
import EventsStackNavigator from "./EventsStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import { theme } from "../theme";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          paddingBottom: theme.spacing.xs,
          paddingTop: theme.spacing.xs,
          height: theme.layout.tabBarHeight,
          alignSelf: "center",
          width: "100%",
          maxWidth: theme.layout.maxWidth,
        },
        tabBarLabelStyle: {
          paddingBottom: theme.spacing.xs,
        },
        animation: "shift",
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
    </Tab.Navigator>
  );
}
