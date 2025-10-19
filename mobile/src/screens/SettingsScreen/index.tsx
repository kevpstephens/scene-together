/*===============================================
 * Settings Screen
 * ==============================================
 * Main settings screen for app configuration.
 * Features:
 * - Organized setting categories
 * - Preferences (notifications, calendar, display)
 * - Privacy & Security controls
 * - Payment method management
 * - About and app information
 * ==============================================
 */

import React, { useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "../../navigation/types";
import {
  BellIcon,
  CalendarIcon,
  SunIcon,
  LockClosedIcon,
  UserCircleIcon,
  CreditCardIcon,
  InformationCircleIcon,
  ArrowRightOnRectangleIcon,
} from "react-native-heroicons/outline";
import { SettingItem } from "./components/SettingItem";
import { SettingSection } from "./components/SettingSection";
import { styles } from "./SettingsScreen.styles";
import { useAuth } from "../../contexts/auth";
import * as Haptics from "expo-haptics";
import { useScrollToTop } from "../ProfileScreen/hooks";

type NavigationProp = NativeStackNavigationProp<
  SettingsStackParamList,
  "SettingsMain"
>;

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll to top when tab is pressed again
  useScrollToTop({ scrollViewRef });

  const handleNavigateToProfile = () => {
    // Navigate to ProfileTab
    navigation.getParent()?.navigate("ProfileTab" as never);
  };

  const handleSignOut = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // On web, use native confirm dialog; on mobile, use Alert
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to sign out?");
      if (!confirmed) return;

      try {
        await signOut();
      } catch (error: any) {
        window.alert(error.message || "Failed to sign out");
      }
    } else {
      Alert.alert("Sign Out", "Are you sure you want to sign out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to sign out");
            }
          },
        },
      ]);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingSection title="Preferences">
          <SettingItem
            icon={BellIcon}
            title="Notifications"
            subtitle="Manage push notifications and alerts"
            badge="Coming Soon"
            disabled={true}
            onPress={() => {}}
          />
          <SettingItem
            icon={CalendarIcon}
            title="Calendar"
            subtitle="Calendar sync and reminders"
            badge="Coming Soon"
            disabled={true}
            onPress={() => {}}
          />
          <SettingItem
            icon={SunIcon}
            title="Display"
            subtitle="Theme and appearance"
            badge="Coming Soon"
            disabled={true}
            onPress={() => {}}
          />
        </SettingSection>

        <SettingSection title="Privacy & Security">
          <SettingItem
            icon={LockClosedIcon}
            title="Privacy"
            subtitle="Data and privacy controls"
            badge="Coming Soon"
            disabled={true}
            onPress={() => {}}
          />
          <SettingItem
            icon={UserCircleIcon}
            title="Account"
            subtitle="View and edit your profile"
            onPress={handleNavigateToProfile}
          />
        </SettingSection>

        <SettingSection title="Payments">
          <SettingItem
            icon={CreditCardIcon}
            title="Payment Methods"
            subtitle="Manage cards and payment options"
            badge="Coming Soon"
            disabled={true}
            onPress={() => {}}
          />
        </SettingSection>

        <SettingSection title="About">
          <SettingItem
            icon={InformationCircleIcon}
            title="About"
            subtitle="Version, terms, and support"
            onPress={() => navigation.navigate("About")}
          />
        </SettingSection>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <ArrowRightOnRectangleIcon size={20} color="#EF4444" />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
