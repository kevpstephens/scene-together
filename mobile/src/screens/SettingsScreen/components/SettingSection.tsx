/*===============================================
 * Setting Section Component
 * ==============================================
 * Groups related settings under a section title.
 * Provides consistent spacing and visual grouping.
 * ==============================================
 */

import React from "react";
import { View, Text } from "react-native";
import { styles } from "../SettingsScreen.styles";

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingSection: React.FC<SettingSectionProps> = ({
  title,
  children,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};
