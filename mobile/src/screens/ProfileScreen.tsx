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
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  EventsStackParamList,
  ProfileStackParamList,
} from "../navigation/types";
import { PencilSquareIcon } from "react-native-heroicons/solid";
import { useAuth } from "../contexts/AuthContext";
import { theme } from "../theme";
import { api } from "../services/api";
import type { Event } from "../types";
import GradientBackground from "../components/GradientBackground";

type RSVP = {
  id: string;
  status: "going" | "interested";
  event: Event;
};

type EventsNavigationProp = NativeStackNavigationProp<EventsStackParamList>;
type ProfileNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

export default function ProfileScreen() {
  const eventsNavigation = useNavigation<EventsNavigationProp>();
  const navigation = useNavigation<ProfileNavigationProp>();
  const { user, userProfile, loading, signOut } = useAuth();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [rsvpsLoading, setRsvpsLoading] = useState(true);

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

  // Show loading state while user data is being fetched
  if (loading || !user) {
    return (
      <View style={styles.wrapper}>
        <GradientBackground />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
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
    <View style={styles.wrapper}>
      <GradientBackground />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {userProfile?.avatarUrl ? (
            <Image
              source={{ uri: userProfile.avatarUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userProfile?.name?.charAt(0).toUpperCase() || "👤"}
              </Text>
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Events ({rsvps.length})</Text>

            {rsvpsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.loadingSmallText}>Loading events...</Text>
              </View>
            ) : rsvps.length === 0 ? (
              <Text style={styles.placeholder}>
                No RSVPs yet. Browse events to get started! 🎬
              </Text>
            ) : (
              <View>
                {rsvps.map((rsvp) => (
                  <TouchableOpacity
                    key={rsvp.id}
                    style={styles.eventCard}
                    onPress={() =>
                      eventsNavigation.navigate("EventDetail", {
                        eventId: rsvp.event.id,
                      })
                    }
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
                      <Text style={styles.eventDate}>
                        📅 {formatDate(rsvp.event.date)} at{" "}
                        {formatTime(rsvp.event.date)}
                      </Text>
                      <Text style={styles.eventLocation} numberOfLines={1}>
                        📍 {rsvp.event.location}
                      </Text>
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
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    padding: theme.spacing.base,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.base,
    marginTop: theme.spacing.xl,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.base,
    marginTop: theme.spacing.xl,
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
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignSelf: "center",
    marginBottom: theme.spacing.xl,
  },
  editButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  section: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    marginBottom: theme.spacing.base,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }
      : theme.shadows.sm),
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  placeholder: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: "center",
    paddingVertical: theme.spacing.lg,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
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
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }
      : theme.shadows.sm),
  },
  eventPoster: {
    width: 80,
    height: 120,
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
    marginBottom: theme.spacing.xs,
  },
  eventLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
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
