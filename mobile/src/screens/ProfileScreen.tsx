import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MainTabParamList, ProfileStackParamList } from "../navigation/types";
import {
  PencilSquareIcon,
  UserIcon,
  FilmIcon,
  CalendarIcon,
  MapPinIcon,
} from "react-native-heroicons/solid";
import { useAuth } from "../contexts/AuthContext";
import { theme } from "../theme";
import { getCardStyle } from "../theme/styles";
import { api } from "../services/api";
import type { Event } from "../types";
import GradientBackground from "../components/GradientBackground";
import AnimatedButton from "../components/AnimatedButton";
import SkeletonLoader from "../components/SkeletonLoader";
import * as Haptics from "expo-haptics";

type RSVP = {
  id: string;
  status: "going" | "interested";
  event: Event;
};

type ProfileScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, "Profile">,
  BottomTabNavigationProp<MainTabParamList>
>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, userProfile, loading, signOut } = useAuth();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [rsvpsLoading, setRsvpsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  // Refetch RSVPs when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchRSVPs();
      }
    }, [user, fetchRSVPs])
  );

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setRefreshing(true);
    await fetchRSVPs();
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setRefreshing(false);
  }, [fetchRSVPs]);

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

  const handleLogout = async () => {
    // On web, use native confirm dialog; on mobile, use Alert
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to sign out?");
      if (!confirmed) return;

      try {
        await signOut();
      } catch (error: any) {
        window.alert(error.message || "Failed to sign out");
      }
    } else {
      Alert.alert("Sign Out", "Are you sure you want to sign out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to sign out");
            }
          },
        },
      ]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <GradientBackground>
      <ScrollView
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
          <View style={styles.profileCard}>
            {userProfile?.avatarUrl ? (
              <Image
                source={{ uri: userProfile.avatarUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatar}>
                {userProfile?.name ? (
                  <Text style={styles.avatarText}>
                    {userProfile.name.charAt(0).toUpperCase()}
                  </Text>
                ) : (
                  <UserIcon size={50} color={theme.colors.text.inverse} />
                )}
              </View>
            )}
            <Text style={styles.name}>{userProfile?.name || "User"}</Text>
            <Text style={styles.email}>{user?.email}</Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("ProfileEdit")}
            >
              <PencilSquareIcon size={20} color={theme.colors.primary} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Events Section Card */}
          <View style={styles.eventsCard}>
            <Text style={styles.sectionTitle}>My Events ({rsvps.length})</Text>

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
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconWrapper}>
                  <FilmIcon size={64} color={theme.colors.primary} />
                </View>
                <Text style={styles.emptyTitle}>No Events Yet</Text>
                <Text style={styles.emptySubtitle}>
                  Start exploring and RSVP to events you're interested in!
                </Text>
                <TouchableOpacity
                  style={styles.emptyActionButton}
                  onPress={() => {
                    // Navigate to Events tab
                    navigation.navigate("EventsTab", { screen: "EventsList" });
                  }}
                >
                  <Text style={styles.emptyActionText}>Browse Events</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {rsvps.map((rsvp) => (
                  <AnimatedButton
                    key={rsvp.id}
                    style={styles.eventCard}
                    onPress={() => {
                      // Premium haptic feedback
                      if (Platform.OS !== "web") {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      }
                      navigation.navigate("EventDetail", {
                        eventId: rsvp.event.id,
                      });
                    }}
                    springConfig={{ damping: 15, stiffness: 100 }}
                  >
                    {rsvp.event.movieData?.poster && (
                      <Image
                        source={{ uri: rsvp.event.movieData.poster }}
                        style={styles.eventPoster}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle} numberOfLines={2}>
                        {rsvp.event.title}
                      </Text>
                      <View style={styles.eventMetaRow}>
                        <CalendarIcon
                          size={14}
                          color={theme.colors.text.secondary}
                        />
                        <Text style={styles.eventDate}>
                          {formatDate(rsvp.event.date)} at{" "}
                          {formatTime(rsvp.event.date)}
                        </Text>
                      </View>
                      <View style={styles.eventMetaRow}>
                        <MapPinIcon
                          size={14}
                          color={theme.colors.text.secondary}
                        />
                        <Text style={styles.eventLocation} numberOfLines={1}>
                          {rsvp.event.location}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          rsvp.status === "going"
                            ? styles.statusGoing
                            : styles.statusInterested,
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {rsvp.status === "going" ? "✓ Going" : "★ Interested"}
                        </Text>
                      </View>
                    </View>
                  </AnimatedButton>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    maxWidth: theme.layout.maxWidth,
    width: "100%",
    alignSelf: "center",
  },
  pageTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
  },
  profileCard: {
    ...getCardStyle(),
    alignItems: "center",
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.base,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.base,
  },
  avatarText: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  name: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.base,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.components.surfaces.section,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginTop: theme.spacing.base,
  },
  editButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  eventsCard: {
    ...getCardStyle(),
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.base,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  emptyActionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 4px 12px rgba(70, 212, 175, 0.3)",
      },
    }),
  },
  emptyActionText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  placeholder: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  eventMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignSelf: "center",
    marginTop: theme.spacing.base,
  },
  logoutButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
  },
  loadingSmallText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: theme.components.surfaces.section,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.components.borders.subtle,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
    minHeight: 120,
  },
  eventPoster: {
    width: 80,
    height: "100%",
  },
  eventInfo: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  eventDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  eventLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusGoing: {
    backgroundColor: "#10B981", // Green
  },
  statusInterested: {
    backgroundColor: "#F59E0B", // Orange
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverse,
  },
});
