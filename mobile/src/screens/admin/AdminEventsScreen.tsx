import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  RefreshControl,
  Modal,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../navigation/types";
import {
  PencilSquareIcon,
  TrashIcon,
  UsersIcon,
  PlusIcon,
  MapPinIcon,
  FilmIcon,
} from "react-native-heroicons/solid";
import { theme } from "../../theme";
import { getCardStyle } from "../../theme/styles";
import { api } from "../../services/api";
import type { Event } from "../../types";
import GradientBackground from "../../components/GradientBackground";

type NavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminEvents"
>;

export default function AdminEventsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Event | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/events");
      // Sort by date (upcoming first)
      const sorted = data.sort(
        (a: Event, b: Event) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setEvents(sorted);
    } catch (error) {
      console.error("Failed to load events:", error);
      Alert.alert("Error", "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleDelete = (event: Event) => {
    console.log("🗑️ Delete button pressed for event:", event.title);
    setConfirmDelete(event);
  };

  const confirmDeleteEvent = async () => {
    if (!confirmDelete) return;

    console.log(
      "🗑️ Confirmed deletion, starting delete for:",
      confirmDelete.id
    );
    setDeleting(confirmDelete.id);
    setConfirmDelete(null);

    try {
      console.log("🗑️ Calling API to delete event:", confirmDelete.id);
      await api.delete(`/events/${confirmDelete.id}`);
      console.log("✅ Event deleted successfully from API");
      setEvents(events.filter((e) => e.id !== confirmDelete.id));
      Alert.alert("Success", "Event deleted successfully");
    } catch (error: any) {
      console.error("❌ Failed to delete event:", error);
      console.error("Error response:", error.response?.data);
      Alert.alert(
        "Error",
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to delete event"
      );
    } finally {
      setDeleting(null);
    }
  };

  const cancelDelete = () => {
    console.log("Delete cancelled");
    setConfirmDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isPastEvent = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const renderEventCard = ({ item }: { item: Event }) => {
    const past = isPastEvent(item.date);
    const fillPercentage = item.maxCapacity
      ? ((item.attendeeCount || 0) / item.maxCapacity) * 100
      : 0;
    const isDeleting = deleting === item.id;

    return (
      <View style={[styles.card, past && styles.cardPast]}>
        <View style={styles.cardHeader}>
          {item.movieData?.poster && (
            <Image
              source={{ uri: item.movieData.poster }}
              style={styles.poster}
              resizeMode="cover"
            />
          )}
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            {item.movieData?.title && (
              <Text style={styles.cardMovie} numberOfLines={1}>
                {item.movieData.title}
              </Text>
            )}
            <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
            <View style={styles.cardLocationContainer}>
              <MapPinIcon size={14} color={theme.colors.text.secondary} />
              <Text style={styles.cardLocation} numberOfLines={1}>
                {item.location}
              </Text>
            </View>

            {/* Capacity */}
            {item.maxCapacity && (
              <View style={styles.capacityContainer}>
                <Text style={styles.capacityText}>
                  {item.attendeeCount || 0} / {item.maxCapacity} spots
                </Text>
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
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={() =>
              navigation.navigate("AdminEventAttendees", {
                eventId: item.id,
              })
            }
          >
            <UsersIcon size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Attendees</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() =>
              navigation.navigate("AdminEventEdit", { eventId: item.id })
            }
          >
            <PencilSquareIcon size={16} color={theme.colors.primary} />
            <Text
              style={[
                styles.actionButtonText,
                styles.actionButtonTextSecondary,
              ]}
            >
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.actionButtonDanger,
              isDeleting && styles.actionButtonDisabled,
            ]}
            onPress={() => handleDelete(item)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color={theme.colors.error} />
            ) : (
              <>
                <TrashIcon size={16} color={theme.colors.error} />
                <Text
                  style={[
                    styles.actionButtonText,
                    styles.actionButtonTextDanger,
                  ]}
                >
                  Delete
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <GradientBackground />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientBackground />
      <View style={styles.contentWrapper}>
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderEventCard}
          contentContainerStyle={
            events.length === 0 ? styles.emptyContainer : styles.list
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
              <FilmIcon size={64} color={theme.colors.text.tertiary} />
              <Text style={styles.emptyTitle}>No events yet</Text>
              <Text style={styles.emptyText}>
                Create your first event to get started
              </Text>
            </View>
          }
        />

        {/* Floating Create Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AdminEventCreate")}
        >
          <PlusIcon size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={!!confirmDelete}
        transparent
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Event</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete "{confirmDelete?.title}"?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={cancelDelete}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={confirmDeleteEvent}
              >
                <Text style={styles.modalButtonTextDelete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    ...(Platform.OS === "web" && { alignItems: "center" }),
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: theme.spacing.base,
    width: "100%",
    ...(Platform.OS === "web" && { maxWidth: theme.layout.maxWidth }),
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
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.base,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  card: {
    width: "100%",
    ...getCardStyle(),
    marginBottom: theme.spacing.base,
  },
  cardPast: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: theme.spacing.base,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.border,
    marginRight: theme.spacing.base,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  cardMovie: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  cardDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  cardLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  cardLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  capacityContainer: {
    marginTop: theme.spacing.xs,
  },
  capacityText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: theme.borderRadius.full,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    marginHorizontal: theme.spacing.xxs,
    borderRadius: theme.borderRadius.md,
  },
  actionButtonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  actionButtonSecondary: {
    backgroundColor: `${theme.colors.primary}20`,
  },
  actionButtonDanger: {
    backgroundColor: `${theme.colors.error}20`,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: "#fff",
    marginLeft: 4,
  },
  actionButtonTextSecondary: {
    color: theme.colors.primary,
  },
  actionButtonTextDanger: {
    color: theme.colors.error,
  },
  fab: {
    position: "absolute",
    right: theme.spacing.base,
    bottom: theme.spacing.base,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 12px 20px rgba(0, 0, 0, 0.6)" }
      : theme.shadows.xl),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: "90%",
    maxWidth: 400,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.8)" }
      : theme.shadows.xl),
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.base,
  },
  modalMessage: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  modalButtonDelete: {
    backgroundColor: theme.colors.error,
  },
  modalButtonTextCancel: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  modalButtonTextDelete: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: "#fff",
  },
});
