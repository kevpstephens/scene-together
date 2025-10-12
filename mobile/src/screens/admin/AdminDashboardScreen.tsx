import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
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
import { getCardStyle } from "../../theme/styles";
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

        {/* Stats Cards - Overlapping Circles like Logo */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            {/* Left Circle - Teal/Cyan */}
            <View
              style={[
                styles.statCircle,
                styles.leftCircle,
                { backgroundColor: "#46D4AF" },
              ]}
            >
              <FilmIcon size={28} color="#fff" />
              <Text style={styles.statValue}>{stats.totalEvents}</Text>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>

            {/* Center Circle - Dark Blue */}
            <View
              style={[
                styles.statCircle,
                styles.centerCircle,
                { backgroundColor: "#1E3A5F" },
              ]}
            >
              <ChartBarIcon size={28} color="#fff" />
              <Text style={styles.statValue}>{stats.upcomingEvents}</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>

            {/* Right Circle - Accent Blue */}
            <View
              style={[
                styles.statCircle,
                styles.rightCircle,
                { backgroundColor: "#2D5F7E" },
              ]}
            >
              <UsersIcon size={28} color="#fff" />
              <Text style={styles.statValue}>{stats.totalAttendees}</Text>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statLabel}>RSVPs</Text>
            </View>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  statsContainer: {
    width: "100%",
    maxWidth: theme.layout.maxWidth,
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  statsGrid: {
    width: "100%",
    height: 180,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  statCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      },
    }),
  },
  leftCircle: {
    left: Platform.OS === "web" ? 20 : 0,
    zIndex: 1,
  },
  centerCircle: {
    left: "50%",
    marginLeft: -70, // Half of width to center
    zIndex: 3, // Highest z-index for center circle (like logo)
  },
  rightCircle: {
    right: Platform.OS === "web" ? 20 : 0,
    zIndex: 2,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: "#fff",
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: "#fff",
    opacity: 0.95,
    lineHeight: 14,
    textAlign: "center",
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
    ...getCardStyle(),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.base,
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
    flexDirection: "row",
    alignItems: "center",
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
