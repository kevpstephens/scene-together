import React from "react";
import { View, Text } from "react-native";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "react-native-heroicons/outline";
import { theme } from "../../../theme";
import { styles } from "../EventDetailScreen.styles";
import type { Event } from "../../../types";
import { formatDate, formatTime } from "../utils";

interface EventInfoCardProps {
  event: Event;
  children?: React.ReactNode; // For action buttons
}

export const EventInfoCard: React.FC<EventInfoCardProps> = ({
  event,
  children,
}) => {
  return (
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
            <Text style={styles.infoValue}>{event.maxCapacity} spots</Text>
          </View>
        </View>
      )}

      {children}
    </View>
  );
};
