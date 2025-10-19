import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  ShareIcon,
  StarIcon as StarIconOutline,
} from "react-native-heroicons/outline";
import { StarIcon } from "react-native-heroicons/solid";
import { theme } from "../../../../theme";
import { styles } from "../../EventsListScreen.styles";
import type { Event, RSVPStatus } from "../../../../types";

interface EventCardHeaderProps {
  event: Event;
  dateLabel: string;
  isUrgent: boolean;
  userRSVPs: Record<string, RSVPStatus>;
  onShare: (event: Event) => void;
  onBookmark: (event: Event) => void;
}

/**
 * Event card header with date badge and action buttons (share, bookmark)
 */
export const EventCardHeader: React.FC<EventCardHeaderProps> = ({
  event,
  dateLabel,
  isUrgent,
  userRSVPs,
  onShare,
  onBookmark,
}) => {
  return (
    <View style={styles.dateActionsRow}>
      <View style={[styles.dateTag, isUrgent && styles.dateTagUrgent]}>
        <Text style={styles.dateTagText}>{dateLabel}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => onShare(event)}
          activeOpacity={0.7}
        >
          <ShareIcon size={25} color={theme.colors.primaryLight} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            userRSVPs[event.id] === "interested" && styles.iconButtonActive,
          ]}
          onPress={() => onBookmark(event)}
          activeOpacity={0.7}
        >
          {userRSVPs[event.id] === "interested" ? (
            <StarIcon size={25} color={theme.colors.warning} />
          ) : (
            <StarIconOutline size={25} color={theme.colors.primaryLight} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
