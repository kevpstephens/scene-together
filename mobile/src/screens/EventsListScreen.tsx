import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
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
  Share,
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
import {
  ShareIcon,
  StarIcon as StarIconOutline,
} from "react-native-heroicons/outline";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EventsStackParamList } from "../navigation/types";
import { api } from "../services/api";
import { theme } from "../theme";
import { getPlatformGlow, getCardStyle } from "../theme/styles";
import type { Event, RSVPStatus } from "../types";
import EventCardSkeleton from "../components/EventCardSkeleton";
import AnimatedButton from "../components/AnimatedButton";
import GradientBackground from "../components/GradientBackground";
import { useToast } from "../contexts/ToastContext";
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
  const [userRSVPs, setUserRSVPs] = useState<Record<string, RSVPStatus>>({});
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadEvents();
    loadUserRSVPs();
  }, []);

  // Configure header to match other screens - dynamically show/hide
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: isHeaderVisible,
      headerTitle: () => (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            ...(Platform.OS === "web" && {
              width: "100%",
              position: "absolute",
              left: 0,
              right: 0,
            }),
          }}
        >
          <Image
            source={require("../../assets/logo/logo-transparent.png")}
            style={{ width: 200, height: 50 }}
            resizeMode="contain"
          />
        </View>
      ),
      ...(Platform.OS === "web" && {
        headerTitleAlign: "center",
      }),
    });
  }, [navigation, isHeaderVisible]);

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

  // Handle header visibility on scroll
  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    // Show header when at top (0-10px), hide when scrolled down
    if (scrollY <= 10) {
      setIsHeaderVisible(true);
    } else {
      setIsHeaderVisible(false);
    }
  };

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

    // Show header when pull-to-refresh
    setIsHeaderVisible(true);

    await Promise.all([loadEvents(), loadUserRSVPs()]);
    setRefreshing(false);

    // Success haptic on refresh complete (native only)
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const formatDate = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();

    // Strip time for accurate day comparison
    const eventDateOnly = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );
    const todayDateOnly = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // Calculate difference in days
    const diffTime = eventDateOnly.getTime() - todayDateOnly.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // Only show special labels for TODAY and TOMORROW
    if (diffDays === 0) return "TODAY";
    if (diffDays === 1) return "TOMORROW";

    // For all other dates, show formatted date
    return eventDate
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      .toUpperCase();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleShare = async (event: Event) => {
    try {
      // Build share message
      let shareMessage = `${event.title}\n\n`;

      if (event.movieData?.title) {
        shareMessage += `Movie: ${event.movieData.title}\n`;
      }
      shareMessage += `📅 ${formatDate(event.date)} at ${formatTime(event.date)}\n`;
      shareMessage += `📍 ${event.location}\n`;

      if (event.price && event.price > 0) {
        if (event.payWhatYouCan) {
          shareMessage += `💰 Pay What You Can (min £${((event.minPrice || 0) / 100).toFixed(2)})\n`;
        } else {
          shareMessage += `💰 £${(event.price / 100).toFixed(2)}\n`;
        }
      } else {
        shareMessage += `🎟️ Free Event\n`;
      }

      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({
            title: event.title,
            text: shareMessage,
            url: window.location.href,
          });
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(shareMessage);
          alert("Event details copied to clipboard!");
        }
      } else {
        await Share.share({
          message: shareMessage,
          title: event.title,
        });

        // Haptic feedback on success
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error: any) {
      if (error.message !== "User did not share") {
        console.error("Share error:", error);
      }
    }
  };

  const loadUserRSVPs = async () => {
    try {
      const response = await api.get("/me/rsvps");
      const rsvpMap: Record<string, RSVPStatus> = {};
      response.data.forEach((rsvp: any) => {
        rsvpMap[rsvp.eventId] = rsvp.status;
      });
      setUserRSVPs(rsvpMap);
    } catch (error) {
      console.error("Failed to load user RSVPs:", error);
      // Don't show error - user might not have any RSVPs yet
    }
  };

  const handleBookmark = async (event: Event) => {
    try {
      // Haptic feedback on tap
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const currentStatus = userRSVPs[event.id];
      const isCurrentlyInterested = currentStatus === "interested";

      if (isCurrentlyInterested) {
        // Remove RSVP (unmark as interested)
        // Optimistically update UI by removing the entry
        setUserRSVPs((prev) => {
          const updated = { ...prev };
          delete updated[event.id];
          return updated;
        });

        // Make DELETE API call
        await api.delete(`/events/${event.id}/rsvp`);

        // Show success feedback
        showToast("Removed from interested", "success");
      } else {
        // Mark as interested
        // Optimistically update UI
        setUserRSVPs((prev) => ({
          ...prev,
          [event.id]: "interested",
        }));

        // Make POST API call
        await api.post(`/events/${event.id}/rsvp`, { status: "interested" });

        // Show success feedback
        showToast("⭐ Added to interested!", "success");
      }

      // Success haptic feedback
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Failed to update RSVP:", error);
      // Revert optimistic update
      await loadUserRSVPs();
      showToast("Failed to update. Please try again.", "error");
    }
  };

  // Calculate event status using real RSVP data
  const getEventStatus = (event: Event) => {
    // Check if event is in the past (start time has passed)
    const eventDate = new Date(event.date);
    const now = new Date();
    if (eventDate.getTime() < now.getTime()) {
      // Event start time has passed
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

    // If event start time has passed, it's past
    if (eventDate.getTime() < now.getTime()) return "past";

    // Check if event is today (but hasn't started yet)
    const isToday =
      eventDate.getDate() === now.getDate() &&
      eventDate.getMonth() === now.getMonth() &&
      eventDate.getFullYear() === now.getFullYear();

    if (isToday) return "ongoing"; // "Today" filter

    // Event is in the future
    return "upcoming";
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
    if (filterStatus === "all") {
      // "All" means all non-past events (upcoming + ongoing)
      filtered = filtered.filter(
        (event) => getEventTimeStatus(event) !== "past"
      );
    } else {
      // Filter by specific status
      filtered = filtered.filter(
        (event) => getEventTimeStatus(event) === filterStatus
      );
    }

    return filtered;
  }, [events, debouncedSearchQuery, filterStatus]);

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
    const priceInfo = formatPrice(item);
    const dateLabel = formatDate(item.date);
    const isUrgent = dateLabel === "TODAY" || dateLabel === "TOMORROW";

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

            {/* Price Badge on Poster with Gradient */}
            {priceInfo && (
              <View style={styles.priceBadgeOnPoster}>
                <LinearGradient
                  colors={
                    priceInfo.label === "FREE"
                      ? [`${priceInfo.color}F0`, `${priceInfo.color}D9`] // Solid for free
                      : [
                          `${priceInfo.color}F0`,
                          `${priceInfo.color}CC`,
                          `${priceInfo.color}E6`,
                        ] // Gradient for paid
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.priceBadgeGradient,
                    {
                      borderColor: `${priceInfo.color}`,
                    },
                  ]}
                >
                  <Text
                    style={[styles.priceTextOnPoster, { color: "#FFFFFF" }]}
                  >
                    {priceInfo.label}
                  </Text>
                </LinearGradient>
              </View>
            )}
          </View>
        )}
        <View style={styles.cardContent}>
          {/* Date Badge and Action Buttons Row */}
          <View style={styles.dateActionsRow}>
            <View
              style={[
                styles.dateTag,
                isUrgent && styles.dateTagUrgent, // Special styling for urgent dates
              ]}
            >
              <Text style={styles.dateTagText}>{dateLabel}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleShare(item)}
                activeOpacity={0.7}
              >
                <ShareIcon size={25} color={theme.colors.primaryLight} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  userRSVPs[item.id] === "interested" &&
                    styles.iconButtonActive,
                ]}
                onPress={() => handleBookmark(item)}
                activeOpacity={0.7}
              >
                {userRSVPs[item.id] === "interested" ? (
                  <StarIcon size={25} color={theme.colors.warning} />
                ) : (
                  <StarIconOutline
                    size={25}
                    color={theme.colors.primaryLight}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          {/* Time and Location Row */}
          <View style={styles.timeLocationRow}>
            <View style={styles.timeContainer}>
              <ClockIcon size={16} color={theme.colors.primaryLight} />
              <Text style={styles.time}>{formatTime(item.date)}</Text>
            </View>
            {item.location && (
              <>
                <Text style={styles.dotSeparator}>•</Text>
                <View style={styles.locationContainer}>
                  <MapPinIcon size={16} color={theme.colors.primaryLight} />
                  <Text style={styles.location}>{item.location}</Text>
                </View>
              </>
            )}
          </View>

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

  // Search and filters that scroll with the list
  const renderListHeader = () => (
    <View>
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
    </View>
  );

  return (
    <View style={styles.container}>
      <GradientBackground />
      <View style={styles.contentWrapper}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
            ref={flatListRef}
            data={filteredEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderEventCard}
            ListHeaderComponent={renderListHeader}
            contentContainerStyle={
              filteredEvents.length === 0 ? styles.emptyContainer : styles.list
            }
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
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
    justifyContent: "center", // Center-align filter chips
    paddingHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.md, // More spacing before event list
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
    paddingTop: 0, // Header is now part of the list, no extra padding needed
  },
  emptyContainer: {
    flexGrow: 1,
    paddingTop: 0, // Header is now part of the list, no extra padding needed
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
    borderRadius: 20, // Increased from default for more modern feel
    borderWidth: 1.5, // Slightly thicker border
    borderColor: `${theme.colors.primary}20`, // Subtle teal border (12.5% opacity)
    // Enhanced depth with glow
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: `0 4px 16px rgba(70, 212, 175, 0.1), 0 0 0 1px ${theme.colors.primary}20`,
      },
    }),
  },
  posterContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 16 / 9, // Maintain movie poster aspect ratio (16:9)
    borderRadius: theme.components.radii.poster,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)", // Subtle white border
    ...getPlatformGlow("subtle"),
    // Inner shadow for depth
    ...Platform.select({
      web: {
        boxShadow:
          "inset 0 2px 8px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.2)",
      },
    }),
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
  priceBadgeOnPoster: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
  },
  priceBadgeGradient: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1.5,
    // Web-compatible shadow (subtle)
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
      },
    }),
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
    paddingTop: theme.spacing.md, // Reduced to bring date badge closer to poster
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md, // Reduced to tighten bottom spacing
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  dateActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  dateTag: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    // Web-compatible shadow
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.08)",
        }
      : theme.shadows.sm),
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  iconButton: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.components.surfaces.section,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  iconButtonActive: {
    backgroundColor: `${theme.colors.warning}20`, // Subtle orange background
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.warning,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: `0px 2px 6px ${theme.colors.warning}40`,
      },
    }),
  },
  timeLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: theme.spacing.sm,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  dotSeparator: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginHorizontal: theme.spacing.sm,
  },
  dateTagText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  dateTagUrgent: {
    backgroundColor: theme.colors.warning, // Brighter orange for urgency
    borderWidth: 2,
    borderColor: `${theme.colors.warning}40`, // Subtle glow effect
    // Enhanced shadow for urgent dates
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.warning,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: `0px 4px 12px ${theme.colors.warning}60`,
      },
    }),
  },
  title: {
    fontSize: theme.typography.fontSize.xxl, // Increased from xl to xxl
    fontWeight: "800" as any, // Extra bold (800 weight)
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md, // Increased for better separation
    lineHeight: theme.typography.fontSize.xxl * 1.25, // Tighter line height for xxl
    letterSpacing: -0.5, // Slightly tighter letter spacing for impact
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm, // Increased from xs for better rhythm
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
    flexShrink: 1,
    marginLeft: theme.spacing.xs,
  },
  movieInfo: {
    marginTop: theme.spacing.sm, // Reduced for tighter spacing
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
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)", // Subtle border for definition
    // Enhanced shadows for depth
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow:
          "0px 3px 6px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.15)",
      },
    }),
  },
  genreChipText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  capacityContainer: {
    marginTop: theme.spacing.lg, // Reduced for tighter spacing
  },
  capacityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
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
    height: 6, // Slightly taller for better visibility
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
    // Inner shadow for depth
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      web: {
        boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.3)",
      },
    }),
  },
  progressBar: {
    height: "100%",
    borderRadius: theme.borderRadius.full,
    // Dynamic color is set inline based on percentage
    // Add subtle gradient overlay
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
      },
    }),
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
