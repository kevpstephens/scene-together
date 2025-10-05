import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
          paddingBottom: theme.spacing.sm,
          paddingTop: theme.spacing.sm,
          height: theme.layout.tabBarHeight,
        },
      }}
    >
      <Tab.Screen
        name="EventsTab"
        component={EventsStackNavigator}
        options={{
          tabBarLabel: "Events",
          tabBarIcon: ({ color }) => <TabIcon name="🎬" color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => <TabIcon name="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Simple emoji icon component (we'll improve this with react-native-vector-icons later)
function TabIcon({ name, color }: { name: string; color: string }) {
  return <Text style={{ fontSize: 24 }}>{name}</Text>;
}
