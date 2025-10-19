import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { api } from "../../../../services/api";

export interface AdminStats {
  totalEvents: number;
  upcomingEvents: number;
  totalAttendees: number;
  loading: boolean;
}

export interface UseAdminStatsReturn {
  stats: AdminStats;
  refreshing: boolean;
  loadStats: (isRefreshing?: boolean) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const useAdminStats = (): UseAdminStatsReturn => {
  const [stats, setStats] = useState<AdminStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalAttendees: 0,
    loading: true,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setStats((prev) => ({ ...prev, loading: true }));
      }
      const { data: events } = await api.get("/events");
      const now = new Date();
      const upcoming = events.filter(
        (event: any) => new Date(event.date) > now
      );
      const totalAttendees = events.reduce(
        (sum: number, event: any) => sum + (event.attendeeCount || 0),
        0
      );

      setStats({
        totalEvents: events.length,
        upcomingEvents: upcoming.length,
        totalAttendees,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const onRefresh = async () => {
    // Light haptic on pull start (native only)
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setRefreshing(true);
    await loadStats(true);
    setRefreshing(false);

    // Success haptic on refresh complete (native only)
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    stats,
    refreshing,
    loadStats,
    onRefresh,
  };
};
