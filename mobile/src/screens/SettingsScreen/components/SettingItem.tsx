/*===============================================
 * Setting Item Component
 * ==============================================
 * Individual setting row with icon, title, subtitle, and chevron.
 * Includes haptic feedback on press.
 * ==============================================
 */

import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import * as Haptics from "expo-haptics";
import { theme } from "../../../theme";
import { styles } from "../SettingsScreen.styles";

interface SettingItemProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon: Icon,
  title,
  subtitle,
  onPress,
}) => {
  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <TouchableOpacity style={styles.settingItem} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Icon size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRightIcon size={20} color={theme.colors.text.tertiary} />
    </TouchableOpacity>
  );
};
