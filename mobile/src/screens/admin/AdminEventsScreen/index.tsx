/*===============================================
 * Admin Events Screen
 * ==============================================
 * Event management interface for admins.
 * Features:
 * - List all events with upcoming/past filtering
 * - Event counts on filter badges
 * - Edit, delete, and view attendees actions
 * - Pull-to-refresh with haptic feedback
 * - Delete confirmation dialog
 * ==============================================
 */

import React from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../../navigation/types";
import { theme } from "../../../theme";
import GradientBackground from "../../../components/GradientBackground";
import { useEventsData } from "./hooks/useEventsData";
import { useEventActions } from "./hooks/useEventActions";
import { styles } from "./AdminEventsScreen.styles";
import {
  EventCard,
  EmptyState,
  DeleteConfirmModal,
  FloatingActionButton,
  FilterTabs,
} from "./components";
import type { Event } from "../../../types";

type NavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminEvents"
>;

export default function AdminEventsScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Events data hook
  const {
    allEvents,
    filteredEvents,
    loading,
    refreshing,
    eventFilter,
    upcomingCount,
    pastCount,
    onRefresh,
    setEvents,
    setEventFilter,
  } = useEventsData();

  // Event actions hook
  const {
    deleting,
    confirmDelete,
    handleDelete,
    confirmDeleteEvent,
    cancelDelete,
  } = useEventActions({ events: allEvents, setEvents });

  const renderEventCard = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      isDeleting={deleting === item.id}
      onNavigateAttendees={() =>
        navigation.navigate("AdminEventAttendees", { eventId: item.id })
      }
      onNavigateEdit={() =>
        navigation.navigate("AdminEventEdit", { eventId: item.id })
      }
      onDelete={() => handleDelete(item)}
    />
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <GradientBackground />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primaryLight} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientBackground />
      <View style={styles.contentWrapper}>
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEventCard}
          contentContainerStyle={
            filteredEvents.length === 0 ? styles.emptyContainer : styles.list
          }
          ListHeaderComponent={
            <FilterTabs
              activeFilter={eventFilter}
              onFilterChange={setEventFilter}
              upcomingCount={upcomingCount}
              pastCount={pastCount}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primaryLight]}
              tintColor={theme.colors.primaryLight}
            />
          }
          ListEmptyComponent={
            <EmptyState
              onCreateEvent={() => navigation.navigate("AdminEventCreate")}
            />
          }
        />

        <FloatingActionButton
          onPress={() => navigation.navigate("AdminEventCreate")}
        />
      </View>

      <DeleteConfirmModal
        visible={!!confirmDelete}
        eventTitle={confirmDelete?.title}
        onConfirm={confirmDeleteEvent}
        onCancel={cancelDelete}
      />
    </View>
  );
}
