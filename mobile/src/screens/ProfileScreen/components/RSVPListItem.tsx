import React from "react";
import { View, Text, Image, Platform } from "react-native";
import { CalendarIcon, MapPinIcon } from "react-native-heroicons/solid";
import * as Haptics from "expo-haptics";
import { theme } from "../../../theme";
import { styles } from "../ProfileScreen.styles";
import AnimatedButton from "../../../components/AnimatedButton";
import { formatDate, formatTime } from "../utils";
import type { RSVP } from "../hooks";

interface RSVPListItemProps {
  rsvp: RSVP;
  onPress: (eventId: string) => void;
}

/**
 * Individual RSVP list item displaying event details
 */
export const RSVPListItem: React.FC<RSVPListItemProps> = ({
  rsvp,
  onPress,
}) => {
  return (
    <AnimatedButton
      style={styles.eventCard}
      onPress={() => {
        // Premium haptic feedback
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onPress(rsvp.event.id);
      }}
      springConfig={{ damping: 15, stiffness: 100 }}
    >
      {rsvp.event.movieData?.poster && (
        <Image
          source={{ uri: rsvp.event.movieData.poster }}
          style={styles.eventPoster}
          resizeMode="cover"
        />
      )}
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {rsvp.event.title}
        </Text>
        <View style={styles.eventMetaRow}>
          <CalendarIcon size={14} color={theme.colors.text.secondary} />
          <Text style={styles.eventDate}>
            {formatDate(rsvp.event.date)} at {formatTime(rsvp.event.date)}
          </Text>
        </View>
        <View style={styles.eventMetaRow}>
          <MapPinIcon size={14} color={theme.colors.text.secondary} />
          <Text style={styles.eventLocation} numberOfLines={1}>
            {rsvp.event.location}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            rsvp.status === "going"
              ? styles.statusGoing
              : styles.statusInterested,
          ]}
        >
          <Text style={styles.statusText}>
            {rsvp.status === "going" ? "Going" : "Interested"}
          </Text>
        </View>
      </View>
    </AnimatedButton>
  );
};
