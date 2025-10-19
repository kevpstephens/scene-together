import React from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import type { EventCreator } from "../../../types";
import { theme } from "../../../theme";
import { styles } from "../EventDetailScreen.styles";

interface EventOrganizerProps {
  creator: EventCreator | null | undefined;
  onPress: () => void;
}

/**
 * Event detail organizer section with avatar, name, and role badge
 * Tappable to view full organizer profile
 */
export const EventOrganizer: React.FC<EventOrganizerProps> = ({
  creator,
  onPress,
}) => {
  if (!creator) {
    return null;
  }

  const displayName = creator.name || "Anonymous";

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <View style={styles.organizerContainer}>
      <View style={styles.organizerHeaderRow}>
        <Ionicons
          name="person-circle-outline"
          size={20}
          color={theme.colors.primaryLight}
        />
        <Text style={styles.organizerSectionTitle}>Event Organiser</Text>
      </View>

      <TouchableOpacity
        style={styles.organizerCard}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.organizerAvatarContainer}>
          {creator.avatarUrl ? (
            <Image
              source={{ uri: creator.avatarUrl }}
              style={styles.organizerAvatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.organizerAvatarPlaceholder}>
              <Ionicons
                name="person"
                size={28}
                color={theme.colors.text.secondary}
              />
            </View>
          )}
        </View>

        <View style={styles.organizerInfoContainer}>
          <Text style={styles.organizerName}>{displayName}</Text>
          <View style={styles.organizerRoleBadge}>
            <Text style={styles.organizerRoleText}>Organiser</Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={24}
          color={theme.colors.text.secondary}
        />
      </TouchableOpacity>
    </View>
  );
};
