import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { AdminStackParamList } from "../../navigation/types";
import { UserIcon } from "react-native-heroicons/solid";
import { theme } from "../../theme";
import { api } from "../../services/api";
import GradientBackground from "../../components/GradientBackground";

type RouteParams = RouteProp<AdminStackParamList, "AdminEventAttendees">;

interface Attendee {
  id: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

interface Event {
  id: string;
  title: string;
  date: string;
  maxCapacity: number;
}

export default function AdminEventAttendeesScreen() {
  const route = useRoute<RouteParams>();
  const { eventId } = route.params;

  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAttendees();
  }, [eventId]);

  const loadAttendees = async () => {
    try {
      setLoading(true);
      const [eventResponse, attendeesResponse] = await Promise.all([
        api.get(`/events/${eventId}`),
        api.get(`/events/${eventId}/attendees`),
      ]);

      setEvent(eventResponse.data);
      setAttendees(attendeesResponse.data);
    } catch (error) {
      console.error("Failed to load attendees:", error);
      Alert.alert("Error", "Failed to load attendees");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAttendees();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return theme.colors.success;
      case "PENDING":
        return theme.colors.warning;
      case "CANCELLED":
        return theme.colors.error;
      default:
        return theme.colors.text.tertiary;
    }
  };

  const renderAttendee = ({ item }: { item: Attendee }) => (
    <View style={styles.attendeeCard}>
      <View style={styles.attendeeIcon}>
        <UserIcon size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.attendeeInfo}>
        <Text style={styles.attendeeName}>
          {item.user.name || item.user.email}
        </Text>
        {item.user.name && (
          <Text style={styles.attendeeEmail}>{item.user.email}</Text>
        )}
        <Text style={styles.attendeeDate}>
          RSVP: {formatDate(item.createdAt)}
        </Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: `${getStatusColor(item.status)}20` },
        ]}
      >
        <Text
          style={[styles.statusText, { color: getStatusColor(item.status) }]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );

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

  const capacity = event.maxCapacity;
  const currentAttendees = attendees.length;
  const fillPercentage = capacity ? (currentAttendees / capacity) * 100 : 0;

  return (
    <View style={styles.container}>
      <GradientBackground />
      <View style={styles.contentWrapper}>
        {/* Event Info Header */}
        <View style={styles.header}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={styles.eventDate}>{formatDate(event.date)}</Text>

          {/* Capacity Info */}
          <View style={styles.capacityCard}>
            <View style={styles.capacityRow}>
              <Text style={styles.capacityLabel}>Capacity</Text>
              <Text style={styles.capacityValue}>
                {currentAttendees} / {capacity}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${fillPercentage}%`,
                    backgroundColor:
                      fillPercentage >= 90
                        ? theme.colors.error
                        : fillPercentage >= 70
                          ? theme.colors.warning
                          : theme.colors.accent,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Attendees List */}
        <FlatList
          data={attendees}
          keyExtractor={(item) => item.id}
          renderItem={renderAttendee}
          contentContainerStyle={
            attendees.length === 0 ? styles.emptyContainer : styles.list
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <UserIcon size={64} color={theme.colors.text.tertiary} />
              <Text style={styles.emptyTitle}>No RSVPs yet</Text>
              <Text style={styles.emptyText}>
                Attendees will appear here when they RSVP to this event
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentWrapper: {
    flex: 1,
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  header: {
    width: "100%",
    maxWidth: theme.layout.maxWidth,
    padding: theme.spacing.base,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  eventTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  eventDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.base,
  },
  capacityCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
  },
  capacityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  capacityLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  capacityValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: theme.borderRadius.full,
  },
  list: {
    padding: theme.spacing.base,
    width: "100%",
    maxWidth: theme.layout.maxWidth,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    padding: theme.spacing.xxxl,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.base,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  attendeeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    marginBottom: theme.spacing.base,
    ...theme.shadows.sm,
  },
  attendeeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.base,
  },
  attendeeInfo: {
    flex: 1,
  },
  attendeeName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  attendeeEmail: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  attendeeDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
