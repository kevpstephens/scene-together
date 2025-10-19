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
  AdjustmentsHorizontalIcon,
} from "react-native-heroicons/outline";
import { FilmIcon as FilmIconSolid } from "react-native-heroicons/solid";
import { UserIcon as UserIconSolid } from "react-native-heroicons/solid";
import { Cog6ToothIcon as Cog6ToothIconSolid } from "react-native-heroicons/solid";
import { AdjustmentsHorizontalIcon as AdjustmentsHorizontalIconSolid } from "react-native-heroicons/solid";
import { MainTabParamList } from "./types";
import EventsStackNavigator from "./EventsStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import AdminStackNavigator from "./AdminStackNavigator";
import SettingsStackNavigator from "./SettingsStackNavigator";
import { theme } from "../theme";
import { useAuth } from "../contexts/auth";
import * as Haptics from "expo-haptics";
import { Platform, View, Image } from "react-native";
import { styles } from "./MainTabNavigator.styles";

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

/**
 * Profile Avatar Icon
 * Shows user avatar if available, otherwise shows default user icon
 */
interface ProfileAvatarIconProps {
  focused: boolean;
  color: string;
  avatarUrl: string | null | undefined;
}

const ProfileAvatarIcon: React.FC<ProfileAvatarIconProps> = ({
  focused,
  color,
  avatarUrl,
}) => {
  return (
    <View style={styles.iconContainer}>
      {/* Active indicator line */}
      {focused && <View style={styles.activeIndicator} />}
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={[styles.profileAvatar, focused && styles.profileAvatarFocused]}
          resizeMode="cover"
        />
      ) : (
        <>
          {focused ? (
            <UserIconSolid size={24} color={color} />
          ) : (
            <UserIcon size={24} color={color} />
          )}
        </>
      )}
    </View>
  );
};

/**
 * Main Tab Navigator
 * Conditionally shows Admin tab based on user role
 */
export default function MainTabNavigator() {
  const { isAdmin, userProfile } = useAuth();

  return (
    <Tab.Navigator
      initialRouteName="EventsTab"
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
            <ProfileAvatarIcon
              focused={focused}
              color={color}
              avatarUrl={userProfile?.avatarUrl}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              IconOutline={AdjustmentsHorizontalIcon}
              IconSolid={AdjustmentsHorizontalIconSolid}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
