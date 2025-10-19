import { useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { api } from "../../../services/api";
import type { Event, RSVPStatus } from "../../../types";

/**
 * Custom hook for loading and managing event data
 * Handles event details, RSVP status, and refresh functionality
 */
export const useEventData = (eventId: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRSVP, setUserRSVP] = useState<RSVPStatus | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [posterError, setPosterError] = useState(false);
  const [demoNoticeSeen, setDemoNoticeSeen] = useState(false);

  // Check if event has already started
  const eventHasStarted = event
    ? new Date(event.date).getTime() < new Date().getTime()
    : false;

  const loadEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error("Failed to load event:", error);
      Alert.alert("Error", "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const loadUserRSVP = async () => {
    try {
      // Fetch user's RSVPs and find this event
      const response = await api.get("/me/rsvps");
      const eventRSVP = response.data.find(
        (rsvp: any) => rsvp.eventId === eventId
      );
      const rsvpStatus = eventRSVP?.status || null;
      setUserRSVP(rsvpStatus);

      // Cache RSVP status to prevent flash on navigation
      if (rsvpStatus) {
        await AsyncStorage.setItem(`rsvp_${eventId}`, rsvpStatus);
      } else {
        await AsyncStorage.removeItem(`rsvp_${eventId}`);
      }
    } catch (error) {
      console.error("Failed to load RSVP status:", error);
      // Don't show error - user might not have RSVP'd yet
    }
  };

  // Pull to refresh handler
  const onRefresh = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setRefreshing(true);
    await Promise.all([loadEvent(), loadUserRSVP()]);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setRefreshing(false);
  };

  // Initial load effect
  useEffect(() => {
    // Load cached RSVP status immediately to prevent flash
    AsyncStorage.getItem(`rsvp_${eventId}`).then((cachedRSVP) => {
      if (cachedRSVP) {
        setUserRSVP(cachedRSVP as RSVPStatus);
      }
    });

    // Then fetch fresh data in the background
    loadEvent();
    loadUserRSVP();

    // Read whether the demo notice was dismissed
    AsyncStorage.getItem("demo_payment_notice_dismissed").then((v) => {
      if (v === "1") setDemoNoticeSeen(true);
    });
  }, [eventId]);

  return {
    // State
    event,
    loading,
    userRSVP,
    refreshing,
    posterError,
    eventHasStarted,
    demoNoticeSeen,
    // Setters
    setEvent,
    setUserRSVP,
    setPosterError,
    setDemoNoticeSeen,
    // Actions
    loadEvent,
    loadUserRSVP,
    onRefresh,
  };
};
