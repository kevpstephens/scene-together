import { useState, useCallback, useMemo } from "react";
import { api } from "../../../services/api";
import type { Event } from "../../../types";

export type RSVP = {
  id: string;
  status: "going" | "interested";
  event: Event;
};

export type Payment = {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
    date: string;
  };
};

export type EventFilter = "upcoming" | "interested" | "past";

export type UserStats = {
  totalAttended: number;
  upcomingCount: number;
  recentEvent: Event | undefined;
  favoriteGenres: string[];
};

interface UseProfileDataReturn {
  // State
  rsvps: RSVP[];
  rsvpsLoading: boolean;
  payments: Payment[];
  paymentsLoading: boolean;
  refreshing: boolean;
  eventFilter: EventFilter;
  // Computed
  filteredRsvps: RSVP[];
  userStats: UserStats;
  // Actions
  fetchRSVPs: () => Promise<void>;
  fetchPaymentHistory: () => Promise<void>;
  setEventFilter: (filter: EventFilter) => void;
  setRefreshing: (refreshing: boolean) => void;
}

/**
 * Custom hook for managing profile data (RSVPs, payments, stats)
 */
export const useProfileData = (): UseProfileDataReturn => {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [rsvpsLoading, setRsvpsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [eventFilter, setEventFilter] = useState<EventFilter>("upcoming");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  // Fetch user's RSVPs
  const fetchRSVPs = useCallback(async () => {
    try {
      setRsvpsLoading(true);
      const response = await api.get("/me/rsvps");
      setRsvps(response.data);
    } catch (error) {
      console.error("Failed to fetch RSVPs:", error);
    } finally {
      setRsvpsLoading(false);
    }
  }, []);

  // Fetch user's payment history
  const fetchPaymentHistory = useCallback(async () => {
    try {
      setPaymentsLoading(true);
      const response = await api.get("/payments/history");
      setPayments(response.data);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
    } finally {
      setPaymentsLoading(false);
    }
  }, []);

  // Filter RSVPs based on selected filter
  const filteredRsvps = useMemo(() => {
    const now = new Date();

    return rsvps.filter((rsvp) => {
      const eventDate = new Date(rsvp.event.date);
      const isPast = eventDate.getTime() < now.getTime();

      switch (eventFilter) {
        case "upcoming":
          // Only show events user is "going" to, not just "interested"
          return rsvp.status === "going" && !isPast;
        case "interested":
          return rsvp.status === "interested" && !isPast;
        case "past":
          return isPast;
        default:
          return true;
      }
    });
  }, [rsvps, eventFilter]);

  // Calculate user stats
  const userStats = useMemo((): UserStats => {
    const now = new Date();

    // Separate past and upcoming events
    const pastEvents = rsvps.filter(
      (rsvp) =>
        rsvp.status === "going" &&
        new Date(rsvp.event.date).getTime() < now.getTime()
    );
    const upcomingEvents = rsvps.filter(
      (rsvp) =>
        rsvp.status === "going" &&
        new Date(rsvp.event.date).getTime() >= now.getTime()
    );

    // Get most recent attended event
    const recentEvent = pastEvents.sort(
      (a, b) =>
        new Date(b.event.date).getTime() - new Date(a.event.date).getTime()
    )[0];

    // Calculate favorite genres
    const genreCounts: { [key: string]: number } = {};
    rsvps.forEach((rsvp) => {
      if (rsvp.event.movieData?.genre) {
        const genres = rsvp.event.movieData.genre.split(",");
        genres.forEach((genre) => {
          const trimmed = genre.trim();
          genreCounts[trimmed] = (genreCounts[trimmed] || 0) + 1;
        });
      }
    });

    const favoriteGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    return {
      totalAttended: pastEvents.length,
      upcomingCount: upcomingEvents.length,
      recentEvent: recentEvent?.event,
      favoriteGenres,
    };
  }, [rsvps]);

  return {
    // State
    rsvps,
    rsvpsLoading,
    payments,
    paymentsLoading,
    refreshing,
    eventFilter,
    // Computed
    filteredRsvps,
    userStats,
    // Actions
    fetchRSVPs,
    fetchPaymentHistory,
    setEventFilter,
    setRefreshing,
  };
};
