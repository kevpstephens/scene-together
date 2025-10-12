import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  Animated,
  Platform,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  FilmIcon,
  StarIcon,
  FireIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from "react-native-heroicons/solid";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EventsStackParamList } from "../navigation/types";
import { api } from "../services/api";
import { theme } from "../theme";
import { getPlatformGlow, getCardStyle } from "../theme/styles";
import type { Event } from "../types";
import EventCardSkeleton from "../components/EventCardSkeleton";
import AnimatedButton from "../components/AnimatedButton";
import GradientBackground from "../components/GradientBackground";
import * as Haptics from "expo-haptics";

type NavigationProp = NativeStackNavigationProp<
  EventsStackParamList,
  "EventsList"
>;

// Genre color mapping
const getGenreColor = (genre: string): string => {
  const genreLower = genre.toLowerCase();

  if (genreLower.includes("action")) return "#ef4444"; // Red
  if (genreLower.includes("adventure")) return "#f59e0b"; // Amber
  if (genreLower.includes("comedy")) return "#fbbf24"; // Yellow
  if (genreLower.includes("drama")) return "#8b5cf6"; // Purple
  if (genreLower.includes("sci-fi") || genreLower.includes("science fiction"))
    return "#06b6d4"; // Cyan
  if (genreLower.includes("horror")) return "#dc2626"; // Dark red
  if (genreLower.includes("thriller")) return "#7c3aed"; // Violet
  if (genreLower.includes("romance")) return "#ec4899"; // Pink
  if (genreLower.includes("fantasy")) return "#a855f7"; // Purple
  if (genreLower.includes("mystery")) return "#6366f1"; // Indigo
  if (genreLower.includes("animation")) return "#10b981"; // Green
  if (genreLower.includes("documentary")) return "#0ea5e9"; // Blue

  return "#46D4AF"; // Default - Turquoise from palette
};

type FilterStatus = "all" | "upcoming" | "ongoing" | "past";

export default function EventsListScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle tab press - scroll to top when already on this screen
  useEffect(() => {
    const parent = navigation.getParent();
    if (!parent) return;

    const unsubscribe = (parent as any).addListener("tabPress", (e: any) => {
      // Only trigger scroll if screen is already focused (second tap)
      if (isFocused) {
        // Haptic feedback for premium feel
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Scroll to top with animation
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }
      // If not focused, let default navigation happen (first tap)
    });

    return unsubscribe;
  }, [navigation, isFocused]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events");
      // Sort events by date (upcoming first)
      const sortedEvents = response.data.sort(
        (a: Event, b: Event) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setEvents(sortedEvents);

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    // Light haptic on pull start (native only)
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    await loadEvents();
    setRefreshing(false);

    // Success haptic on refresh complete (native only)
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays > 1 && diffDays < 7) return `In ${diffDays} days`;

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
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

  // Calculate event status using real RSVP data
  const getEventStatus = (event: Event) => {
    // Check if event is in the past
    const eventDate = new Date(event.date);
    const now = new Date();
    if (eventDate.getTime() < now.getTime() - 24 * 60 * 60 * 1000) {
      // Event is more than 24 hours old
      return { type: "past" as const, label: "Past Event" };
    }

    if (!event.maxCapacity) return null;

    // Use real attendee count from API (defaults to 0 if no RSVPs yet)
    const currentAttendees = event.attendeeCount || 0;
    const percentageFull = (currentAttendees / event.maxCapacity) * 100;

    // Granular capacity-based statuses
    if (currentAttendees >= event.maxCapacity) {
      return { type: "soldOut" as const, label: "Sold Out" };
    } else if (percentageFull >= 90) {
      return { type: "almostFull" as const, label: "Almost Full" };
    } else if (percentageFull >= 70) {
      return { type: "nearlyFull" as const, label: "Nearly Full" };
    } else if (percentageFull >= 50) {
      return { type: "fillingUp" as const, label: "Filling Up" };
    } else if (percentageFull >= 30) {
      return { type: "available" as const, label: "Available" };
    } else {
      // 0-30% (including 0 attendees)
      return { type: "plentySpace" as const, label: "Plenty of Space" };
    }
  };

  // Get event time status
  const getEventTimeStatus = (
    event: Event
  ): "upcoming" | "ongoing" | "past" => {
    const eventDate = new Date(event.date);
    const now = new Date();

    // Check if event is today
    const isToday =
      eventDate.getDate() === now.getDate() &&
      eventDate.getMonth() === now.getMonth() &&
      eventDate.getFullYear() === now.getFullYear();

    if (isToday) return "ongoing"; // "Today" filter

    // Check if event is in the future or past
    if (eventDate.getTime() > now.getTime()) return "upcoming";
    return "past";
  };

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Apply search query (debounced)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.movieData?.title?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.movieData?.genre?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (event) => getEventTimeStatus(event) === filterStatus
      );
    }

    return filtered;
  }, [events, debouncedSearchQuery, filterStatus]);

  // Check if event is featured (for demo, make first event featured)
  const isFeatured = (event: Event, index: number) => {
    return index === 0; // First event is featured
  };

  // Format price for display
  const formatPrice = (
    event: Event
  ): { label: string; color: string } | null => {
    if (!event.price || event.price === 0) {
      return { label: "FREE", color: theme.colors.success };
    }

    const priceInPounds = (event.price / 100).toFixed(2);

    if (event.payWhatYouCan) {
      if (event.minPrice && event.minPrice > 0) {
        const minInPounds = (event.minPrice / 100).toFixed(2);
        return {
          label: `£${minInPounds}+ PWYC`,
          color: theme.colors.accent,
        };
      }
      return {
        label: `£${priceInPounds}+ PWYC`,
        color: theme.colors.accent,
      };
    }

    return { label: `£${priceInPounds}`, color: theme.colors.primary };
  };

  const renderEventCard = ({ item, index }: { item: Event; index: number }) => {
    const status = getEventStatus(item);
    const featured = isFeatured(item, index);
    const priceInfo = formatPrice(item);

    return (
      <AnimatedButton
        style={styles.card}
        onPress={() => {
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          navigation.navigate("EventDetail", { eventId: item.id });
        }}
        springConfig={{ damping: 15, stiffness: 100 }}
      >
        {item.movieData?.poster && (
          <View style={styles.posterContainer}>
            <Image
              source={{ uri: item.movieData.poster }}
              style={styles.poster}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.posterGradient}
            />

            {/* Featured Badge */}
            {featured && (
              <View style={styles.featuredBadge}>
                <StarIcon size={14} color={theme.colors.text.inverse} />
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            )}

            {/* Price Badge on Poster */}
            {priceInfo && (
              <View
                style={[
                  styles.priceBadgeOnPoster,
                  {
                    backgroundColor: `${priceInfo.color}E6`, // 90% opacity for better visibility
                    borderColor: `${priceInfo.color}`,
                  },
                ]}
              >
                <Text style={[styles.priceTextOnPoster, { color: "#FFFFFF" }]}>
                  {priceInfo.label}
                </Text>
              </View>
            )}
          </View>
        )}
        <View style={styles.cardContent}>
          {/* Date Badge */}
          <View style={styles.dateTag}>
            <Text style={styles.dateTagText}>{formatDate(item.date)}</Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.detailsRow}>
            <ClockIcon size={16} color={theme.colors.text.secondary} />
            <Text style={styles.time}>{formatTime(item.date)}</Text>
          </View>

          {item.location && (
            <View style={styles.detailsRow}>
              <MapPinIcon size={16} color={theme.colors.text.secondary} />
              <Text style={styles.location} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          )}

          {item.movieData && (
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle} numberOfLines={1}>
                {item.movieData.title}
              </Text>
              {item.movieData.genre && (
                <View style={styles.genreContainer}>
                  {item.movieData.genre
                    .split(",")
                    .slice(0, 3)
                    .map((genre, index) => {
                      const trimmedGenre = genre.trim();
                      return (
                        <View
                          key={index}
                          style={[
                            styles.genreChip,
                            { backgroundColor: getGenreColor(trimmedGenre) },
                          ]}
                        >
                          <Text style={styles.genreChipText} numberOfLines={1}>
                            {trimmedGenre}
                          </Text>
                        </View>
                      );
                    })}
                </View>
              )}
            </View>
          )}

          {item.maxCapacity && (
            <View style={styles.capacityContainer}>
              <View style={styles.capacityRow}>
                <UsersIcon size={14} color={theme.colors.text.tertiary} />
                <Text style={styles.capacityText}>
                  {item.attendeeCount || 0} / {item.maxCapacity} spots
                </Text>

                {/* Status Badge in Capacity Row */}
                {status && (
                  <View
                    style={[
                      styles.statusBadgeInline,
                      status.type === "soldOut" && styles.soldOutBadge,
                      status.type === "almostFull" && styles.almostFullBadge,
                      status.type === "nearlyFull" && styles.nearlyFullBadge,
                      status.type === "fillingUp" && styles.fillingUpBadge,
                      status.type === "available" && styles.availableBadge,
                      status.type === "plentySpace" && styles.plentySpaceBadge,
                      status.type === "past" && styles.pastBadge,
                    ]}
                  >
                    {status.type === "soldOut" && (
                      <XMarkIcon size={10} color={theme.colors.text.inverse} />
                    )}
                    {status.type === "almostFull" && (
                      <FireIcon size={10} color={theme.colors.text.inverse} />
                    )}
                    {status.type === "nearlyFull" && (
                      <ExclamationTriangleIcon
                        size={10}
                        color={theme.colors.text.inverse}
                      />
                    )}
                    {status.type === "fillingUp" && (
                      <ChartBarIcon
                        size={10}
                        color={theme.colors.text.inverse}
                      />
                    )}
                    {status.type === "available" && (
                      <CheckCircleIcon
                        size={10}
                        color={theme.colors.text.inverse}
                      />
                    )}
                    {status.type === "plentySpace" && (
                      <CheckCircleIcon
                        size={10}
                        color={theme.colors.text.inverse}
                      />
                    )}
                    <Text style={styles.statusTextInline}>{status.label}</Text>
                  </View>
                )}
              </View>
              {/* Dynamic Color-Coded Progress Bar */}
              <View style={styles.progressBarContainer}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: `${((item.attendeeCount || 0) / item.maxCapacity) * 100}%`,
                      backgroundColor: (() => {
                        const percentage =
                          ((item.attendeeCount || 0) / item.maxCapacity) * 100;
                        if (percentage >= 100) return theme.colors.error;
                        if (percentage >= 90) return "#FF6B35"; // Orange-red
                        if (percentage >= 70) return theme.colors.warning;
                        if (percentage >= 50) return "#FFC857"; // Yellow
                        if (percentage >= 30) return theme.colors.accent;
                        return theme.colors.success; // Green for plenty of space
                      })(),
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </View>
      </AnimatedButton>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.list}>
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientBackground />
      <View style={styles.contentWrapper}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <MagnifyingGlassIcon size={20} color={theme.colors.text.tertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search events, movies, locations..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setSearchQuery("");
                }}
              >
                <XMarkIcon size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Chips */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterStatus === "all" && styles.filterChipActive,
              ]}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setFilterStatus("all");
              }}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterStatus === "all" && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterStatus === "upcoming" && styles.filterChipActive,
              ]}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setFilterStatus("upcoming");
              }}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterStatus === "upcoming" && styles.filterChipTextActive,
                ]}
              >
                Upcoming
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterStatus === "ongoing" && styles.filterChipActive,
              ]}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setFilterStatus("ongoing");
              }}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterStatus === "ongoing" && styles.filterChipTextActive,
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterStatus === "past" && styles.filterChipActive,
              ]}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setFilterStatus("past");
              }}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterStatus === "past" && styles.filterChipTextActive,
                ]}
              >
                Past
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={filteredEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderEventCard}
            contentContainerStyle={
              filteredEvents.length === 0 ? styles.emptyContainer : styles.list
            }
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primaryLight]}
                tintColor={theme.colors.primaryLight}
              />
            }
            ListEmptyComponent={
              <Animated.View
                style={[styles.emptyContent, { opacity: fadeAnim }]}
              >
                <View style={styles.emptyIconContainer}>
                  <FilmIcon size={80} color={theme.colors.primary} />
                  <View style={styles.emptyIconAccent} />
                </View>
                <Text style={styles.emptyTitle}>🍿 Grab Your Popcorn!</Text>
                <Text style={styles.emptySubtext}>
                  No screenings scheduled yet
                </Text>
                <Text style={styles.emptyHint}>
                  New movie events are added weekly.{"\n"}
                  Pull down to refresh!
                </Text>
                <View style={styles.emptyFeatures}>
                  <View style={styles.featureItem}>
                    <StarIcon size={16} color={theme.colors.accent} />
                    <Text style={styles.featureText}>Exclusive screenings</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <UsersIcon size={16} color={theme.colors.accent} />
                    <Text style={styles.featureText}>Meet film lovers</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <FilmIcon size={16} color={theme.colors.accent} />
                    <Text style={styles.featureText}>Classic & new films</Text>
                  </View>
                </View>
              </Animated.View>
            }
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
    maxWidth: theme.layout.maxWidth,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.components.surfaces.card,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.base,
    marginTop: theme.spacing.base,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.components.borders.default,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.components.surfaces.section,
    borderWidth: 1,
    borderColor: theme.components.borders.default,
    marginHorizontal: theme.spacing.xs,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  filterChipTextActive: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  list: {
    padding: theme.spacing.base,
  },
  emptyContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIconContainer: {
    position: "relative",
    marginBottom: theme.spacing.xl,
  },
  emptyIconAccent: {
    position: "absolute",
    bottom: -8,
    right: -8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent,
    opacity: 0.2,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  emptyHint: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.tertiary,
    textAlign: "center",
    lineHeight: theme.typography.fontSize.base * 1.6,
    marginBottom: theme.spacing.xl,
  },
  emptyFeatures: {
    alignSelf: "center",
    flexDirection: "column",
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    paddingVertical:
      Platform.OS === "web" ? theme.spacing.xl : theme.spacing.lg,
    paddingHorizontal:
      Platform.OS === "web" ? theme.spacing.xxl : theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.components.borders.default,
    minWidth: 280,
    // Web-compatible shadow
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.12)",
        }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }),
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Platform.OS === "web" ? theme.spacing.lg : theme.spacing.md,
  },
  featureText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: Platform.OS === "web" ? theme.spacing.lg : theme.spacing.md,
    flex: 1,
  },
  card: {
    ...getCardStyle(),
    marginBottom: theme.spacing.lg,
    overflow: "hidden",
  },
  posterContainer: {
    position: "relative",
    width: "100%",
    height: 240,
    borderRadius: theme.components.radii.poster,
    overflow: "hidden",
    ...getPlatformGlow("subtle"),
  },
  poster: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.border,
  },
  posterGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
  },
  featuredBadge: {
    position: "absolute",
    top: theme.spacing.md,
    left: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${theme.colors.primary}CC`, // More subtle with 80% opacity
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    // Web-compatible shadow (more subtle)
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.12)",
        }
      : theme.shadows.md),
  },
  featuredText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginLeft: theme.spacing.xs,
  },
  priceBadgeOnPoster: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1.5,
    // Web-compatible shadow (subtle)
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        }
      : theme.shadows.sm),
  },
  priceTextOnPoster: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  statusBadge: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    // Web-compatible shadow
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.12)",
        }
      : theme.shadows.md),
  },
  almostFullBadge: {
    backgroundColor: "#FF6B35", // Orange-red (90%+)
  },
  nearlyFullBadge: {
    backgroundColor: theme.colors.warning, // Orange (70-90%)
  },
  fillingUpBadge: {
    backgroundColor: "#FFC857", // Yellow (50-70%)
  },
  soldOutBadge: {
    backgroundColor: theme.colors.error, // Red (100%)
  },
  availableBadge: {
    backgroundColor: theme.colors.accent, // Teal (30-50%)
  },
  plentySpaceBadge: {
    backgroundColor: theme.colors.success, // Green (0-30%)
  },
  pastBadge: {
    backgroundColor: theme.colors.text.tertiary,
    opacity: 0.8,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginLeft: theme.spacing.xs,
  },
  cardContent: {
    padding: theme.spacing.base,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  dateTag: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.sm,
    // Web-compatible shadow
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.08)",
        }
      : theme.shadows.sm),
  },
  dateTagText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.fontSize.xl * 1.3,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  time: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.xs,
  },
  location: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
    flex: 1,
    marginLeft: theme.spacing.xs,
  },
  movieInfo: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  movieTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -theme.spacing.xxs,
  },
  genreChip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.full,
    marginHorizontal: theme.spacing.xxs,
    marginBottom: theme.spacing.xs,
    // Web-compatible shadow
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.08)",
        }
      : theme.shadows.sm),
  },
  genreChipText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  capacityContainer: {
    marginTop: theme.spacing.md, // Increased spacing from genre chips
  },
  capacityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  capacityText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  statusBadgeInline: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  statusTextInline: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.full,
  },
  priceBadge: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  priceText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
});
