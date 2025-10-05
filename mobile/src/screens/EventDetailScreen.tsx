import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { EventsStackParamList } from "../navigation/types";

type RouteProps = RouteProp<EventsStackParamList, "EventDetail">;

export default function EventDetailScreen() {
  const route = useRoute<RouteProps>();
  const { eventId } = route.params;

  // TODO: Fetch event details from API
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Event Details</Text>
        <Text style={styles.subtitle}>Event ID: {eventId}</Text>
        <Text style={styles.placeholder}>
          🎬 Full event details coming soon!
        </Text>
        <Text style={styles.hint}>
          Will include movie poster, trailer, RSVP button, and more...
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 32,
  },
  placeholder: {
    fontSize: 48,
    textAlign: "center",
    marginBottom: 16,
  },
  hint: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
