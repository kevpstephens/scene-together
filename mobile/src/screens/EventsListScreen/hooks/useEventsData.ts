/*===============================================
 * useEventsData Hook
 * ==============================================
 * Manages event list data, filtering, search, and RSVP status.
 * Implements debounced search and smart filtering logic.
 * ==============================================
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { Animated } from "react-native";
import { api } from "../../../services/api";
import { getEventTimeStatus } from "../utils";
import type { Event, RSVPStatus } from "../../../types";

export type FilterStatus = "all" | "upcoming" | "ongoing" | "past";

interface UseEventsDataReturn {
  // State
  events: Event[];
  loading: boolean;
  refreshing: boolean;
  searchQuery: string;
  debouncedSearchQuery: string;
  filterStatus: FilterStatus;
  userRSVPs: Record<string, RSVPStatus>;
  failedPosters: Record<string, boolean>;
  fadeAnim: Animated.Value;
  filteredEvents: Event[];
  // Setters
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: FilterStatus) => void;
  setUserRSVPs: React.Dispatch<
    React.SetStateAction<Record<string, RSVPStatus>>
  >;
  setFailedPosters: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  // Actions
  loadEvents: () => Promise<void>;
  loadUserRSVPs: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

/**
 * Custom hook for managing events data, loading, filtering, and RSVPs
 */
export const useEventsData = (): UseEventsDataReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [userRSVPs, setUserRSVPs] = useState<Record<string, RSVPStatus>>({});
  const [failedPosters, setFailedPosters] = useState<Record<string, boolean>>(
    {}
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Initial load
  useEffect(() => {
    loadEvents();
    loadUserRSVPs();
  }, []);

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * Load events from API
   */
  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events");
      // Sort events by date (upcoming first)
      const sortedEvents = response.data.sort(
        (a: Event, b: Event) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setEvents(sortedEvents);

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load user RSVPs from API
   */
  const loadUserRSVPs = async () => {
    try {
      const response = await api.get("/me/rsvps");
      const rsvpMap: Record<string, RSVPStatus> = {};
      response.data.forEach((rsvp: any) => {
        rsvpMap[rsvp.eventId] = rsvp.status;
      });
      setUserRSVPs(rsvpMap);
    } catch (error) {
      console.error("Failed to load user RSVPs:", error);
      // Don't show error - user might not have any RSVPs yet
    }
  };

  /**
   * Refresh events and RSVPs (pull-to-refresh)
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadEvents(), loadUserRSVPs()]);
    setRefreshing(false);
  };

  /**
   * Filter and search events
   */
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Apply search query (debounced)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.movieData?.title?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.movieData?.genre?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus === "all") {
      // "All" means all non-past events (upcoming + ongoing)
      filtered = filtered.filter(
        (event) => getEventTimeStatus(event) !== "past"
      );
    } else {
      // Filter by specific status
      filtered = filtered.filter(
        (event) => getEventTimeStatus(event) === filterStatus
      );
    }

    return filtered;
  }, [events, debouncedSearchQuery, filterStatus]);

  return {
    // State
    events,
    loading,
    refreshing,
    searchQuery,
    debouncedSearchQuery,
    filterStatus,
    userRSVPs,
    failedPosters,
    fadeAnim,
    filteredEvents,
    // Setters
    setSearchQuery,
    setFilterStatus,
    setUserRSVPs,
    setFailedPosters,
    // Actions
    loadEvents,
    loadUserRSVPs,
    onRefresh,
  };
};
