import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FilmIcon, CalendarIcon } from "react-native-heroicons/solid";
import { theme } from "../../../theme";
import { styles } from "../ProfileScreen.styles";
import type { EventFilter } from "../hooks";

interface EmptyStateProps {
  type: "no-rsvps" | "no-filtered-results";
  eventFilter?: EventFilter;
  onBrowseEvents?: () => void;
}

/**
 * Empty state component for when user has no RSVPs or filtered results
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  eventFilter,
  onBrowseEvents,
}) => {
  if (type === "no-rsvps") {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrapper}>
          <FilmIcon size={64} color={theme.colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>No Events Yet</Text>
        <Text style={styles.emptySubtitle}>
          Start exploring and RSVP to events you're interested in!
        </Text>
        {onBrowseEvents && (
          <TouchableOpacity
            style={styles.emptyActionButton}
            onPress={onBrowseEvents}
          >
            <Text style={styles.emptyActionText}>Browse Events</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <CalendarIcon size={64} color={theme.colors.text.tertiary} />
      </View>
      <Text style={styles.emptyTitle}>
        {eventFilter === "upcoming" && "No Upcoming Events"}
        {eventFilter === "interested" && "No Events You're Interested In"}
        {eventFilter === "past" && "No Past Events"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {eventFilter === "past"
          ? "Your event history will appear here"
          : "Try browsing more events or changing your filter"}
      </Text>
    </View>
  );
};
