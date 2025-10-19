import React from "react";
import { View, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { styles } from "../../EventsListScreen.styles";
import { formatDate, getEventStatus, formatPrice } from "../../utils";
import AnimatedButton from "../../../../components/AnimatedButton";
import type { Event, RSVPStatus } from "../../../../types";
import { EventCardPoster } from "./EventCardPoster";
import { EventCardHeader } from "./EventCardHeader";
import { EventCardDetails } from "./EventCardDetails";
import { EventCardCapacity } from "./EventCardCapacity";
import { EventCardOrganizer } from "./EventCardOrganizer";

interface EventCardProps {
  event: Event;
  userRSVPs: Record<string, RSVPStatus>;
  failedPosters: Record<string, boolean>;
  onNavigate: (eventId: string) => void;
  onNavigateToProfile: (userId: string) => void;
  onShare: (event: Event) => void;
  onBookmark: (event: Event) => void;
  onPosterError: (eventId: string) => void;
}

/**
 * Event card component displaying event details in a rich, interactive card
 */
export const EventCard: React.FC<EventCardProps> = ({
  event,
  userRSVPs,
  failedPosters,
  onNavigate,
  onNavigateToProfile,
  onShare,
  onBookmark,
  onPosterError,
}) => {
  const status = getEventStatus(event);
  const priceInfo = formatPrice(event);
  const dateLabel = formatDate(event.date);
  const isUrgent = dateLabel === "TODAY" || dateLabel === "TOMORROW";

  return (
    <AnimatedButton
      style={styles.card}
      onPress={() => {
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onNavigate(event.id);
      }}
      springConfig={{ damping: 15, stiffness: 100 }}
    >
      <EventCardPoster
        event={event}
        priceInfo={priceInfo}
        failedPosters={failedPosters}
        onPosterError={onPosterError}
      />

      <View style={styles.cardContent}>
        <EventCardHeader
          event={event}
          dateLabel={dateLabel}
          isUrgent={isUrgent}
          userRSVPs={userRSVPs}
          onShare={onShare}
          onBookmark={onBookmark}
        />

        <EventCardDetails event={event} />

        <EventCardOrganizer
          creator={event.createdBy}
          onPress={() => {
            if (event.createdBy?.id) {
              onNavigateToProfile(event.createdBy.id);
            }
          }}
        />

        <EventCardCapacity event={event} status={status} />
      </View>
    </AnimatedButton>
  );
};
