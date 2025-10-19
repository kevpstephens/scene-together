import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  StarIcon,
  FireIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from "react-native-heroicons/solid";
import {
  ShareIcon,
  StarIcon as StarIconOutline,
} from "react-native-heroicons/outline";
import * as Haptics from "expo-haptics";
import { theme } from "../../../theme";
import { styles } from "../EventsListScreen.styles";
import {
  getGenreColor,
  formatDate,
  formatTime,
  getEventStatus,
  formatPrice,
} from "../utils";
import AnimatedButton from "../../../components/AnimatedButton";
import PosterPlaceholder from "../../../components/PosterPlaceholder";
import type { Event, RSVPStatus } from "../../../types";

interface EventCardProps {
  event: Event;
  userRSVPs: Record<string, RSVPStatus>;
  failedPosters: Record<string, boolean>;
  onNavigate: (eventId: string) => void;
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
      <View style={styles.posterContainer}>
        {event.movieData?.poster && !failedPosters[event.id] ? (
          <Image
            source={{ uri: event.movieData.poster }}
            style={styles.poster}
            resizeMode="cover"
            onError={() => {
              // Mark this poster as failed so placeholder shows
              console.log("Poster failed to load for event:", event.id);
              onPosterError(event.id);
            }}
          />
        ) : (
          <PosterPlaceholder
            title={event.movieData?.title || event.title}
            style={styles.poster}
            iconSize={120}
          />
        )}
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
              <Text style={[styles.priceTextOnPoster, { color: "#FFFFFF" }]}>
                {priceInfo.label}
              </Text>
            </LinearGradient>
          </View>
        )}
      </View>
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

        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        {/* Time and Location Row */}
        <View style={styles.timeLocationRow}>
          <View style={styles.timeContainer}>
            <ClockIcon size={16} color={theme.colors.primaryLight} />
            <Text style={styles.time}>{formatTime(event.date)}</Text>
          </View>
          {event.location && (
            <>
              <Text style={styles.dotSeparator}>•</Text>
              <View style={styles.locationContainer}>
                <MapPinIcon size={16} color={theme.colors.primaryLight} />
                <Text style={styles.location}>{event.location}</Text>
              </View>
            </>
          )}
        </View>

        {event.movieData && (
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle} numberOfLines={1}>
              {event.movieData.title}
            </Text>
            {event.movieData.genre && (
              <View style={styles.genreContainer}>
                {event.movieData.genre
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

        {event.maxCapacity && (
          <View style={styles.capacityContainer}>
            <View style={styles.capacityRow}>
              <UsersIcon size={14} color={theme.colors.text.tertiary} />
              <Text style={styles.capacityText}>
                {event.attendeeCount || 0} / {event.maxCapacity} spots
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
                    <ChartBarIcon size={10} color={theme.colors.text.inverse} />
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
                    width: `${((event.attendeeCount || 0) / event.maxCapacity) * 100}%`,
                    backgroundColor: (() => {
                      const percentage =
                        ((event.attendeeCount || 0) / event.maxCapacity) * 100;
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
