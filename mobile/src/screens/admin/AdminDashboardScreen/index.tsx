/*===============================================
 * Admin Dashboard Screen
 * ==============================================
 * Overview dashboard for admin users with key metrics.
 * Features:
 * - Total/upcoming event counts
 * - Total attendee statistics
 * - Quick navigation to manage events and create new
 * - Pull-to-refresh with haptic feedback
 * ==============================================
 */

import React, { useRef } from "react";
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
import { useScrollToTop } from "../../ProfileScreen/hooks";

type NavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminDashboard"
>;

export default function AdminDashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { stats, refreshing, onRefresh } = useAdminStats();
  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll to top when tab is pressed again
  useScrollToTop({ scrollViewRef });

  if (stats.loading) {
    return (
      <View style={styles.container}>
        <GradientBackground />
        <ScrollView
          ref={scrollViewRef}
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
        ref={scrollViewRef}
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
        {/* Welcome Container */}
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeTitle}>
            Welcome to the Admin Dashboard!
          </Text>
          <Text style={styles.welcomeText}>
            Manage, create, and edit your events. View attendee lists, track
            RSVPs, and keep your community engaged with amazing film screenings.
          </Text>
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
