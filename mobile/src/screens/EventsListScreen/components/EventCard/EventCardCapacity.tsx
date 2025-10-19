import React from "react";
import { View, Text, Animated } from "react-native";
import {
  UsersIcon,
  XMarkIcon,
  FireIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from "react-native-heroicons/solid";
import { theme } from "../../../../theme";
import { styles } from "../../EventsListScreen.styles";
import type { Event } from "../../../../types";

interface EventStatus {
  label: string;
  type:
    | "soldOut"
    | "almostFull"
    | "nearlyFull"
    | "fillingUp"
    | "available"
    | "plentySpace"
    | "past";
}

interface EventCardCapacityProps {
  event: Event;
  status: EventStatus | null;
}

/**
 * Event card capacity section with progress bar and status badge
 */
export const EventCardCapacity: React.FC<EventCardCapacityProps> = ({
  event,
  status,
}) => {
  if (!event.maxCapacity) {
    return null;
  }

  const attendeeCount = event.attendeeCount || 0;
  const percentage = (attendeeCount / event.maxCapacity) * 100;

  // Determine progress bar color
  const getProgressBarColor = () => {
    if (percentage >= 100) return theme.colors.error;
    if (percentage >= 90) return "#FF6B35"; // Orange-red
    if (percentage >= 70) return theme.colors.warning;
    if (percentage >= 50) return "#FFC857"; // Yellow
    if (percentage >= 30) return theme.colors.accent;
    return theme.colors.success; // Green for plenty of space
  };

  return (
    <View style={styles.capacityContainer}>
      <View style={styles.capacityRow}>
        <UsersIcon size={14} color={theme.colors.text.tertiary} />
        <Text style={styles.capacityText}>
          {attendeeCount} / {event.maxCapacity} spots
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
              <CheckCircleIcon size={10} color={theme.colors.text.inverse} />
            )}
            {status.type === "plentySpace" && (
              <CheckCircleIcon size={10} color={theme.colors.text.inverse} />
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
              width: `${percentage}%`,
              backgroundColor: getProgressBarColor(),
            },
          ]}
        />
      </View>
    </View>
  );
};
