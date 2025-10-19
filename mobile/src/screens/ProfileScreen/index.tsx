/*===============================================
 * Profile Screen
 * ==============================================
 * User profile with RSVPs, payment history, and account management.
 * Features:
 * - Upcoming and past RSVPs display
 * - Payment history with status indicators
 * - Profile editing navigation
 * - Logout with confirmation
 * - Pull-to-refresh functionality
 * - Scroll-to-top on tab press
 * ==============================================
 */

import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  MainTabParamList,
  ProfileStackParamList,
} from "../../navigation/types";
import { useAuth } from "../../contexts/auth";
import { theme } from "../../theme";
import { styles } from "./ProfileScreen.styles";
import GradientBackground from "../../components/GradientBackground";
import SkeletonLoader from "../../components/SkeletonLoader";
import { useProfileData, useProfileActions, useScrollToTop } from "./hooks";
import {
  ProfileHeader,
  StatsCard,
  EventFilterTabs,
  RSVPListItem,
  EmptyState,
  PaymentHistory,
} from "./components";

type ProfileScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, "Profile">,
  BottomTabNavigationProp<MainTabParamList>
>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, userProfile, loading, signOut } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);

  // Custom hooks
  const {
    rsvps,
    rsvpsLoading,
    payments,
    paymentsLoading,
    refreshing,
    eventFilter,
    filteredRsvps,
    userStats,
    fetchRSVPs,
    fetchPaymentHistory,
    setEventFilter,
    setRefreshing,
  } = useProfileData();

  const { handleLogout, onRefresh } = useProfileActions({
    signOut,
    fetchRSVPs,
    fetchPaymentHistory,
    setRefreshing,
  });

  // Scroll to top when tab is tapped again (matching Events tab behavior)
  useScrollToTop({ scrollViewRef });

  // Refetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchRSVPs();
        fetchPaymentHistory();
      }
    }, [user, fetchRSVPs, fetchPaymentHistory])
  );

  // Show loading state while user data is being fetched
  if (loading || !user) {
    return (
      <View style={styles.wrapper}>
        <GradientBackground />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={theme.colors.primaryLight} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <GradientBackground>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primaryLight]}
            tintColor={theme.colors.primaryLight}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      >
        <View style={styles.content}>
          <Text style={styles.pageTitle}>My Profile</Text>

          {/* User Info Card */}
          <ProfileHeader
            userProfile={userProfile}
            userEmail={user?.email}
            onEditPress={() => navigation.navigate("ProfileEdit")}
          />

          {/* User Stats Section */}
          <StatsCard
            loading={rsvpsLoading}
            rsvps={rsvps}
            userStats={userStats}
          />

          {/* Payment History Section */}
          <PaymentHistory loading={paymentsLoading} payments={payments} />

          {/* Events Section Card */}
          <View style={styles.eventsCard}>
            <Text style={styles.sectionTitle}>
              My Events ({filteredRsvps.length})
            </Text>

            {/* Filter Buttons */}
            <EventFilterTabs
              activeFilter={eventFilter}
              onFilterChange={setEventFilter}
            />

            {/* RSVPs List */}
            {rsvpsLoading ? (
              <View>
                {[1, 2].map((i) => (
                  <View key={i} style={styles.eventCard}>
                    <SkeletonLoader
                      width={80}
                      height={120}
                      style={{ marginRight: theme.spacing.md }}
                    />
                    <View style={{ flex: 1 }}>
                      <SkeletonLoader
                        width="80%"
                        height={18}
                        style={{ marginBottom: 8 }}
                      />
                      <SkeletonLoader
                        width="60%"
                        height={14}
                        style={{ marginBottom: 6 }}
                      />
                      <SkeletonLoader
                        width="70%"
                        height={14}
                        style={{ marginBottom: 8 }}
                      />
                      <SkeletonLoader
                        width={80}
                        height={24}
                        borderRadius={theme.borderRadius.sm}
                      />
                    </View>
                  </View>
                ))}
              </View>
            ) : rsvps.length === 0 ? (
              <EmptyState
                type="no-rsvps"
                onBrowseEvents={() =>
                  navigation.navigate("EventsTab", { screen: "EventsList" })
                }
              />
            ) : filteredRsvps.length === 0 ? (
              <EmptyState
                type="no-filtered-results"
                eventFilter={eventFilter}
              />
            ) : (
              <View>
                {filteredRsvps.map((rsvp) => (
                  <RSVPListItem
                    key={rsvp.id}
                    rsvp={rsvp}
                    onPress={(eventId) =>
                      navigation.navigate("EventDetail", { eventId })
                    }
                  />
                ))}
              </View>
            )}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}
