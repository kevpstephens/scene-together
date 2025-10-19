/*===============================================
 * Admin Event Attendees Screen
 * ==============================================
 * View all RSVPs and payment statuses for a specific event.
 * Features:
 * - List all attendees with user info
 * - Payment status indicators (confirmed, pending, cancelled)
 * - RSVP timestamps
 * - Pull-to-refresh
 * - Empty state handling
 * ==============================================
 */

import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { AdminStackParamList } from "../../../navigation/types";
import { theme } from "../../../theme";
import GradientBackground from "../../../components/GradientBackground";
import { useAttendeesData } from "./hooks";
import { styles } from "./AdminEventAttendeesScreen.styles";
import { AttendeeCard, EventHeader, EmptyState } from "./components";

type RouteParams = RouteProp<AdminStackParamList, "AdminEventAttendees">;

export default function AdminEventAttendeesScreen() {
  const route = useRoute<RouteParams>();
  const { eventId } = route.params;

  const { event, attendees, loading, refreshing, onRefresh } =
    useAttendeesData(eventId);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primaryLight} />
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
    <View style={styles.container}>
      <GradientBackground />
      <EventHeader event={event} currentAttendees={attendees.length} />

      <FlatList
        data={attendees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AttendeeCard attendee={item} />}
        style={styles.list}
        contentContainerStyle={
          attendees.length === 0 ? styles.emptyContainer : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primaryLight]}
            tintColor={theme.colors.primaryLight}
          />
        }
        ListEmptyComponent={<EmptyState />}
      />
    </View>
  );
}
