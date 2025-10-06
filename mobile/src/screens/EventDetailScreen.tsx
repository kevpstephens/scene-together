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
  Linking,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  FilmIcon,
  StarIcon,
  TicketIcon,
} from "react-native-heroicons/outline";
import { useRoute, RouteProp } from "@react-navigation/native";
import { EventsStackParamList } from "../navigation/types";
import { api } from "../services/api";
import { theme } from "../theme";
import type { Event } from "../types";

type RouteProps = RouteProp<EventsStackParamList, "EventDetail">;

// Declare iframe for React Native Web
declare global {
  namespace JSX {
    interface IntrinsicElements {
      iframe: any;
    }
  }
}

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

  const handleOpenIMDB = async () => {
    if (!event?.movieData?.imdbId) {
      Alert.alert("No IMDB", "IMDB link not available for this film");
      return;
    }

    const imdbUrl = `https://www.imdb.com/title/${event.movieData.imdbId}`;

    try {
      const supported = await Linking.canOpenURL(imdbUrl);
      if (supported) {
        await Linking.openURL(imdbUrl);
      } else {
        Alert.alert("Error", "Cannot open IMDB URL");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open IMDB");
    }
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

  const getYouTubeVideoId = (url: string): string | null => {
    // Extract video ID from various YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
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
        {/* Hero Image with Gradient Overlay */}
        {event.movieData?.poster && (
          <View style={styles.heroContainer}>
            <Image
              source={{ uri: event.movieData.poster }}
              style={styles.heroImage}
              resizeMode="contain"
            />
            <LinearGradient
              colors={["transparent", "rgba(250, 250, 250, 0.95)"]}
              style={styles.heroGradient}
            />
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Event Title */}
          <Text style={styles.title}>{event.title}</Text>

          {/* Date & Time */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <CalendarIcon size={20} color={theme.colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{formatDate(event.date)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <ClockIcon size={20} color={theme.colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>{formatTime(event.date)}</Text>
              </View>
            </View>

            {event.location && (
              <View style={styles.infoRow}>
                <MapPinIcon size={20} color={theme.colors.primary} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{event.location}</Text>
                </View>
              </View>
            )}

            {event.maxCapacity && (
              <View style={styles.infoRow}>
                <UsersIcon size={20} color={theme.colors.primary} />
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

              {/* Movie Info Badges Row */}
              <View style={styles.movieMetaRow}>
                {event.movieData.year && (
                  <View style={styles.metaChip}>
                    <CalendarIcon size={12} color={theme.colors.text.inverse} />
                    <Text style={styles.metaChipText}>
                      {event.movieData.year}
                    </Text>
                  </View>
                )}
                {event.movieData.runtime && (
                  <View style={styles.metaChip}>
                    <ClockIcon size={12} color={theme.colors.text.inverse} />
                    <Text style={styles.metaChipText}>
                      {event.movieData.runtime}
                    </Text>
                  </View>
                )}
                {event.movieData.imdbRating && (
                  <View style={styles.metaChip}>
                    <StarIcon size={12} color={theme.colors.text.inverse} />
                    <Text style={styles.metaChipText}>
                      {parseFloat(event.movieData.imdbRating).toFixed(1)}/10
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

              {/* Embedded YouTube Trailer */}
              {event.movieData.trailer &&
                (() => {
                  const videoId = getYouTubeVideoId(event.movieData.trailer);
                  if (videoId) {
                    return (
                      <View style={styles.trailerContainer}>
                        <View style={styles.trailerTitleRow}>
                          <FilmIcon
                            size={18}
                            color={theme.colors.text.primary}
                          />
                          <Text style={styles.trailerTitle}>Watch Trailer</Text>
                        </View>

                        {Platform.OS === "web" ? (
                          // Web: Use iframe directly
                          <View style={styles.videoWrapper}>
                            <iframe
                              style={{
                                width: "100%",
                                height: 220,
                                border: 0,
                                borderRadius: 12,
                              }}
                              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </View>
                        ) : (
                          // Mobile: Use WebView
                          <View style={styles.videoWrapper}>
                            <WebView
                              style={styles.video}
                              source={{
                                html: `
                              <!DOCTYPE html>
                              <html>
                                <head>
                                  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                                  <style>
                                    * { margin: 0; padding: 0; }
                                    body { background: #000; }
                                    .container { position: relative; width: 100%; padding-bottom: 56.25%; }
                                    iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
                                  </style>
                                </head>
                                <body>
                                  <div class="container">
                                    <iframe 
                                      src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
                                      allowfullscreen
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    ></iframe>
                                  </div>
                                </body>
                              </html>
                            `,
                              }}
                              allowsFullscreenVideo
                              javaScriptEnabled
                              domStorageEnabled
                              mediaPlaybackRequiresUserAction={false}
                            />
                          </View>
                        )}
                      </View>
                    );
                  }
                  return null;
                })()}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.rsvpButton}
              onPress={handleRSVP}
              disabled={rsvpLoading}
            >
              {!rsvpLoading && (
                <TicketIcon size={20} color={theme.colors.text.inverse} />
              )}
              <Text style={styles.rsvpButtonText}>
                {rsvpLoading ? "Processing..." : "RSVP for this event"}
              </Text>
            </TouchableOpacity>

            {/* IMDB Button */}
            {event.movieData?.imdbId && (
              <TouchableOpacity
                style={styles.imdbButton}
                onPress={handleOpenIMDB}
              >
                <FilmIcon size={20} color={theme.colors.primary} />
                <Text style={styles.imdbButtonText}>View on IMDB</Text>
              </TouchableOpacity>
            )}
          </View>
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
  heroContainer: {
    position: "relative",
    width: "100%",
    height: 550,
    backgroundColor: theme.colors.backgroundDark,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
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
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
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
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
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
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.sm,
  },
  metaChipText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: 0.5,
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
  trailerContainer: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  trailerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  trailerTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  videoWrapper: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    backgroundColor: "#000",
    ...theme.shadows.md,
  },
  video: {
    width: "100%",
    height: 220,
  },
  actionButtons: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxxl,
    gap: theme.spacing.md,
  },
  rsvpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
  },
  rsvpButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  imdbButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.sm,
  },
  imdbButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
