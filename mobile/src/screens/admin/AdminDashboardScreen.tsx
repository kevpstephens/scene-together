import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../navigation/types";
import {
  FilmIcon,
  UsersIcon,
  PlusCircleIcon,
  ChartBarIcon,
} from "react-native-heroicons/solid";
import { theme } from "../../theme";
import { api } from "../../services/api";
import GradientBackground from "../../components/GradientBackground";

type NavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminDashboard"
>;

export default function AdminDashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalAttendees: 0,
    loading: true,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
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

  if (stats.loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientBackground />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Welcome Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage your events platform</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: "#46D4AF" }]}>
            <FilmIcon size={32} color="#fff" />
            <Text style={styles.statValue}>{stats.totalEvents}</Text>
            <Text style={styles.statLabel}>Total Events</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#23797E" }]}>
            <ChartBarIcon size={32} color="#fff" />
            <Text style={styles.statValue}>{stats.upcomingEvents}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#FF6B9D" }]}>
            <UsersIcon size={32} color="#fff" />
            <Text style={styles.statValue}>{stats.totalAttendees}</Text>
            <Text style={styles.statLabel}>Total RSVPs</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("AdminEventCreate")}
          >
            <View style={styles.actionIconContainer}>
              <PlusCircleIcon size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Create New Event</Text>
              <Text style={styles.actionDescription}>
                Add a new screening event with movie details
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("AdminEvents")}
          >
            <View style={styles.actionIconContainer}>
              <FilmIcon size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Events</Text>
              <Text style={styles.actionDescription}>
                View, edit, and delete existing events
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            🎬 <Text style={styles.infoBold}>Demo Mode:</Text> This is a
            portfolio demonstration project.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.base,
    alignItems: "center",
  },
  header: {
    width: "100%",
    maxWidth: theme.layout.maxWidth,
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  statsGrid: {
    width: "100%",
    maxWidth: theme.layout.maxWidth,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.base,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.lg,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: "#fff",
    marginTop: theme.spacing.md,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: "#fff",
    opacity: 0.9,
    marginTop: theme.spacing.xs,
  },
  section: {
    width: "100%",
    maxWidth: theme.layout.maxWidth,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.base,
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.base,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.base,
    ...theme.shadows.md,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.base,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  actionDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  infoBanner: {
    width: "100%",
    maxWidth: theme.layout.maxWidth,
    backgroundColor: "#FFF4E6",
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.base,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  infoBannerText: {
    fontSize: theme.typography.fontSize.sm,
    color: "#B8860B",
    textAlign: "center",
  },
  infoBold: {
    fontWeight: theme.typography.fontWeight.bold,
  },
});
