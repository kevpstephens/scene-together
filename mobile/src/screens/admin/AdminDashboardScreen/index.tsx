import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../../navigation/types";
import { FilmIcon, PlusCircleIcon } from "react-native-heroicons/solid";
import { theme } from "../../../theme";
import GradientBackground from "../../../components/GradientBackground";
import { useAdminStats } from "./hooks";
import { styles } from "./AdminDashboardScreen.styles";
import { StatsCircles, QuickActionCard, LoadingSkeleton } from "./components";

type NavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminDashboard"
>;

export default function AdminDashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { stats, refreshing, onRefresh } = useAdminStats();

  if (stats.loading) {
    return (
      <View style={styles.container}>
        <GradientBackground />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primaryLight]}
              tintColor={theme.colors.primaryLight}
            />
          }
        >
          <LoadingSkeleton />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientBackground />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primaryLight]}
            tintColor={theme.colors.primaryLight}
          />
        }
      >
        {/* Welcome Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage your events platform</Text>
        </View>

        {/* Stats Cards - Overlapping Circles */}
        <StatsCircles
          totalEvents={stats.totalEvents}
          upcomingEvents={stats.upcomingEvents}
          totalAttendees={stats.totalAttendees}
        />

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <QuickActionCard
            icon={<PlusCircleIcon size={24} color={theme.colors.primary} />}
            title="Create New Event"
            description="Add a new screening event with movie details"
            onPress={() => navigation.navigate("AdminEventCreate")}
          />

          <QuickActionCard
            icon={<FilmIcon size={24} color={theme.colors.primary} />}
            title="Manage Events"
            description="View, edit, and delete existing events"
            onPress={() => navigation.navigate("AdminEvents")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
