/*===============================================
 * useEventsData Hook - AdminEventsScreen
 * ==============================================
 * Manages admin event list data and filtering.
 * Implements upcoming/past event filtering and pull-to-refresh.
 * ==============================================
 */

import { useState, useEffect, useMemo } from "react";
import { Alert, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { api } from "../../../../services/api";
import type { Event } from "../../../../types";

export type EventFilter = "upcoming" | "past";

export interface UseEventsDataReturn {
  allEvents: Event[];
  filteredEvents: Event[];
  loading: boolean;
  refreshing: boolean;
  eventFilter: EventFilter;
  upcomingCount: number;
  pastCount: number;
  loadEvents: (isRefreshing?: boolean) => Promise<void>;
  onRefresh: () => Promise<void>;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setEventFilter: (filter: EventFilter) => void;
}

export const useEventsData = (): UseEventsDataReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [eventFilter, setEventFilter] = useState<EventFilter>("upcoming");

  const loadEvents = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
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
      if (!isRefreshing) {
        setLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    // Light haptic on pull start (native only)
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setRefreshing(true);
    await loadEvents(true);
    setRefreshing(false);

    // Success haptic on refresh complete (native only)
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter events and calculate counts
  const now = new Date();

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const upcoming: Event[] = [];
    const past: Event[] = [];

    events.forEach((event) => {
      if (new Date(event.date) >= now) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    // Sort past events in descending order (latest first)
    past.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  const filteredEvents =
    eventFilter === "upcoming" ? upcomingEvents : pastEvents;

  return {
    allEvents: events,
    filteredEvents,
    loading,
    refreshing,
    eventFilter,
    upcomingCount: upcomingEvents.length,
    pastCount: pastEvents.length,
    loadEvents,
    onRefresh,
    setEvents,
    setEventFilter,
  };
};
