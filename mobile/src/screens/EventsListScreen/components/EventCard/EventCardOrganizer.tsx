import React from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import type { EventCreator } from "../../../../types";
import { theme } from "../../../../theme";
import { styles } from "../../EventsListScreen.styles";

interface EventCardOrganizerProps {
  creator: EventCreator | null | undefined;
  onPress: () => void;
}

/**
 * Event card organizer display with avatar and name
 * Tappable to view organizer profile
 */
export const EventCardOrganizer: React.FC<EventCardOrganizerProps> = ({
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
    <TouchableOpacity
      style={styles.organizerContainer}
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
              size={18}
              color={theme.colors.text.secondary}
            />
          </View>
        )}
      </View>
      <View style={styles.organizerTextContainer}>
        <Text style={styles.organizerLabel}>Hosted by</Text>
        <Text style={styles.organizerName} numberOfLines={1}>
          {displayName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
