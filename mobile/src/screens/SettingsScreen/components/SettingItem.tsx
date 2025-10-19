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
  badge?: string;
  disabled?: boolean;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon: Icon,
  title,
  subtitle,
  onPress,
  badge,
  disabled = false,
}) => {
  const handlePress = () => {
    if (disabled) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.settingItem, disabled && styles.settingItemDisabled]}
      onPress={handlePress}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <View style={styles.iconContainer}>
        <Icon
          size={24}
          color={disabled ? theme.colors.text.tertiary : theme.colors.primary}
        />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.settingTitle,
              disabled && styles.settingTitleDisabled,
            ]}
          >
            {title}
          </Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        {subtitle && (
          <Text
            style={[
              styles.settingSubtitle,
              disabled && styles.settingSubtitleDisabled,
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <ChevronRightIcon size={20} color={theme.colors.text.tertiary} />
    </TouchableOpacity>
  );
};
