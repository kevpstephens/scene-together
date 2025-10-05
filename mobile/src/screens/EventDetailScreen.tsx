import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { EventsStackParamList } from "../navigation/types";
import { api } from "../services/api";
import { theme } from "../theme";
import type { Event } from "../types";

type RouteProps = RouteProp<EventsStackParamList, "EventDetail">;

export default function EventDetailScreen() {
  const route = useRoute<RouteProps>();
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error("Failed to load event:", error);
      Alert.alert("Error", "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async () => {
    // TODO: Implement RSVP functionality
    Alert.alert("RSVP", "RSVP functionality coming soon!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.contentWrapper}>
        {/* Hero Image */}
        {event.movieData?.poster && (
          <Image
            source={{ uri: event.movieData.poster }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Event Title */}
          <Text style={styles.title}>{event.title}</Text>

          {/* Date & Time */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{formatDate(event.date)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🕐</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>{formatTime(event.date)}</Text>
              </View>
            </View>

            {event.location && (
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📍</Text>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{event.location}</Text>
                </View>
              </View>
            )}

            {event.maxCapacity && (
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>👥</Text>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Capacity</Text>
                  <Text style={styles.infoValue}>
                    {event.maxCapacity} spots
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Description */}
          {event.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About this event</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>
          )}

          {/* Movie Details */}
          {event.movieData && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About the film</Text>
              <Text style={styles.movieTitle}>{event.movieData.title}</Text>

              {event.movieData.plot && (
                <Text style={styles.moviePlot}>{event.movieData.plot}</Text>
              )}

              <View style={styles.movieMetaRow}>
                {event.movieData.year && (
                  <View style={styles.metaChip}>
                    <Text style={styles.metaChipText}>
                      {event.movieData.year}
                    </Text>
                  </View>
                )}
                {event.movieData.runtime && (
                  <View style={styles.metaChip}>
                    <Text style={styles.metaChipText}>
                      {event.movieData.runtime}
                    </Text>
                  </View>
                )}
              </View>

              {event.movieData.genre && (
                <Text style={styles.movieMeta}>
                  <Text style={styles.movieMetaLabel}>Genre: </Text>
                  {event.movieData.genre}
                </Text>
              )}
              {event.movieData.director && (
                <Text style={styles.movieMeta}>
                  <Text style={styles.movieMetaLabel}>Director: </Text>
                  {event.movieData.director}
                </Text>
              )}
              {event.movieData.actors && (
                <Text style={styles.movieMeta}>
                  <Text style={styles.movieMetaLabel}>Cast: </Text>
                  {event.movieData.actors}
                </Text>
              )}
            </View>
          )}

          {/* RSVP Button */}
          <TouchableOpacity
            style={styles.rsvpButton}
            onPress={handleRSVP}
            disabled={rsvpLoading}
          >
            <Text style={styles.rsvpButtonText}>
              {rsvpLoading ? "Processing..." : "🎟️ RSVP for this event"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    alignItems: "center",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: theme.layout.maxWidth,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
  },
  heroImage: {
    width: "100%",
    height: 400,
    backgroundColor: theme.colors.border,
  },
  content: {
    padding: theme.spacing.base,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    lineHeight: theme.typography.fontSize.xxxl * 1.2,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    marginBottom: theme.spacing.base,
    ...theme.shadows.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  infoIcon: {
    fontSize: theme.typography.fontSize.xl,
    marginRight: theme.spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xxs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    marginBottom: theme.spacing.base,
    ...theme.shadows.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.base * 1.5,
  },
  movieTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  moviePlot: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.sm * 1.6,
    marginBottom: theme.spacing.md,
  },
  movieMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: theme.spacing.md,
  },
  metaChip: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  metaChipText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  movieMeta: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.fontSize.sm * 1.5,
  },
  movieMetaLabel: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  rsvpButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.base,
    marginBottom: theme.spacing.xxxl,
    ...theme.shadows.md,
  },
  rsvpButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: "center",
  },
});
