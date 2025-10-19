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

import React from "react";
import { View, ScrollView } from "react-native";
import {
  BellIcon,
  CalendarIcon,
  SunIcon,
  LockClosedIcon,
  UserCircleIcon,
  CreditCardIcon,
  InformationCircleIcon,
} from "react-native-heroicons/outline";
import { SettingItem } from "./components/SettingItem";
import { SettingSection } from "./components/SettingSection";
import { styles } from "./SettingsScreen.styles";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingSection title="Preferences">
          <SettingItem
            icon={BellIcon}
            title="Notifications"
            subtitle="Manage push notifications and alerts"
            onPress={() => {
              // TODO: Navigate to notifications settings
              console.log("Notifications pressed");
            }}
          />
          <SettingItem
            icon={CalendarIcon}
            title="Calendar"
            subtitle="Calendar sync and reminders"
            onPress={() => {
              // TODO: Navigate to calendar settings
              console.log("Calendar pressed");
            }}
          />
          <SettingItem
            icon={SunIcon}
            title="Display"
            subtitle="Theme and appearance"
            onPress={() => {
              // TODO: Navigate to display settings
              console.log("Display pressed");
            }}
          />
        </SettingSection>

        <SettingSection title="Privacy & Security">
          <SettingItem
            icon={LockClosedIcon}
            title="Privacy"
            subtitle="Data and privacy controls"
            onPress={() => {
              // TODO: Navigate to privacy settings
              console.log("Privacy pressed");
            }}
          />
          <SettingItem
            icon={UserCircleIcon}
            title="Account"
            subtitle="Manage your account"
            onPress={() => {
              // TODO: Navigate to account settings
              console.log("Account pressed");
            }}
          />
        </SettingSection>

        <SettingSection title="Payments">
          <SettingItem
            icon={CreditCardIcon}
            title="Payment Methods"
            subtitle="Manage cards and payment options"
            onPress={() => {
              // TODO: Navigate to payment settings
              console.log("Payment pressed");
            }}
          />
        </SettingSection>

        <SettingSection title="About">
          <SettingItem
            icon={InformationCircleIcon}
            title="About"
            subtitle="Version, terms, and support"
            onPress={() => {
              // TODO: Navigate to about page
              console.log("About pressed");
            }}
          />
        </SettingSection>
      </ScrollView>
    </View>
  );
}
