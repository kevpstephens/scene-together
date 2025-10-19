import { useState, useEffect } from "react";
import { Platform, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { api } from "../../../../services/api";

export interface Attendee {
  id: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface Event {
  id: string;
  title: string;
  date: string;
  maxCapacity: number;
}

export interface UseAttendeesDataReturn {
  event: Event | null;
  attendees: Attendee[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
}

export const useAttendeesData = (eventId: string): UseAttendeesDataReturn => {
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAttendees = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
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
    // Light haptic on pull start (native only)
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setRefreshing(true);
    await loadAttendees(true);
    setRefreshing(false);

    // Success haptic on refresh complete (native only)
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  useEffect(() => {
    loadAttendees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  return {
    event,
    attendees,
    loading,
    refreshing,
    onRefresh,
  };
};
