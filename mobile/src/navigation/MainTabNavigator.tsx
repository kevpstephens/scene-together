/*===============================================
 * Main Tab Navigator
 * ==============================================
 * Bottom tab navigation for authenticated users.
 * Shows Events, Admin (conditional), and Profile tabs.
 * Features custom tab icons with active indicator line.
 * ==============================================
 */

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  FilmIcon,
  UserIcon,
  Cog6ToothIcon,
} from "react-native-heroicons/outline";
import { FilmIcon as FilmIconSolid } from "react-native-heroicons/solid";
import { UserIcon as UserIconSolid } from "react-native-heroicons/solid";
import { Cog6ToothIcon as Cog6ToothIconSolid } from "react-native-heroicons/solid";
import { MainTabParamList } from "./types";
import EventsStackNavigator from "./EventsStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import AdminStackNavigator from "./AdminStackNavigator";
import { theme } from "../theme";
import { useAuth } from "../contexts/auth";
import * as Haptics from "expo-haptics";
import { Platform, View, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  focused: boolean;
  color: string;
  IconOutline: React.ComponentType<{ size: number; color: string }>;
  IconSolid: React.ComponentType<{ size: number; color: string }>;
}

/**
 * Custom Tab Icon with top indicator
 * Shows solid icon when focused, outline when not
 */
const TabIcon: React.FC<TabIconProps> = ({
  focused,
  color,
  IconOutline,
  IconSolid,
}) => {
  const Icon = focused ? IconSolid : IconOutline;

  return (
    <View style={styles.iconContainer}>
      {/* Active indicator line */}
      {focused && <View style={styles.activeIndicator} />}
      <Icon size={24} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  activeIndicator: {
    position: "absolute",
    top: -12,
    left: "10%",
    right: "10%",
    height: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
});

/**
 * Main Tab Navigator
 * Conditionally shows Admin tab based on user role
 */
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
          // Haptic feedback on tab switch (native only)
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
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              IconOutline={FilmIcon}
              IconSolid={FilmIconSolid}
            />
          ),
        }}
      />
      {isAdmin && (
        <Tab.Screen
          name="AdminTab"
          component={AdminStackNavigator}
          options={{
            tabBarLabel: "Admin",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                focused={focused}
                color={color}
                IconOutline={Cog6ToothIcon}
                IconSolid={Cog6ToothIconSolid}
              />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              IconOutline={UserIcon}
              IconSolid={UserIconSolid}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
