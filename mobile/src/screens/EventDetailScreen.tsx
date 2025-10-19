import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Animated,
  Share,
  RefreshControl,
  TextInput,
  Modal,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  FilmIcon,
  StarIcon,
  TicketIcon,
  CheckCircleIcon,
  HeartIcon,
  XCircleIcon,
  ShareIcon,
  CreditCardIcon,
} from "react-native-heroicons/outline";
import { InformationCircleIcon } from "react-native-heroicons/outline";
import { STRIPE_PUBLISHABLE_KEY } from "../config/stripe";
import { useRoute, RouteProp } from "@react-navigation/native";
import { EventsStackParamList } from "../navigation/types";
import { useStripe } from "../hooks/useStripe";
import { api } from "../services/api";
import { createPaymentIntent } from "../services/payment";
import { theme } from "../theme";
import { getPlatformGlow, getCardStyle } from "../theme/styles";
import type { Event, RSVPStatus } from "../types";
import AnimatedButton from "../components/AnimatedButton";
import GradientBackground from "../components/GradientBackground";
import SuccessConfetti from "../components/SuccessConfetti";
import PosterPlaceholder from "../components/PosterPlaceholder";
import { useToast } from "../contexts/ToastContext";
import * as Haptics from "expo-haptics";
import { promptAddToCalendar } from "../services/calendarService";

type RouteProps = RouteProp<EventsStackParamList, "EventDetail">;

// Genre color mapping (same as EventsListScreen)
const getGenreColor = (genre: string): string => {
  const genreLower = genre.toLowerCase();

  if (genreLower.includes("action")) return "#ef4444"; // Red
  if (genreLower.includes("adventure")) return "#f59e0b"; // Amber
  if (genreLower.includes("comedy")) return "#fbbf24"; // Yellow
  if (genreLower.includes("drama")) return "#8b5cf6"; // Purple
  if (genreLower.includes("sci-fi") || genreLower.includes("science fiction"))
    return "#06b6d4"; // Cyan
  if (genreLower.includes("horror")) return "#dc2626"; // Dark red
  if (genreLower.includes("thriller")) return "#7c3aed"; // Violet
  if (genreLower.includes("romance")) return "#ec4899"; // Pink
  if (genreLower.includes("fantasy")) return "#a855f7"; // Purple
  if (genreLower.includes("mystery")) return "#6366f1"; // Indigo
  if (genreLower.includes("animation")) return "#10b981"; // Green
  if (genreLower.includes("documentary")) return "#0ea5e9"; // Blue

  return "#46D4AF"; // Default - Turquoise from palette
};

// Declare iframe for React Native Web
declare global {
  namespace JSX {
    interface IntrinsicElements {
      iframe: any;
    }
  }
}

export default function EventDetailScreen() {
  const route = useRoute<RouteProps>();
  const { eventId } = route.params;
  const { showToast } = useToast();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [userRSVP, setUserRSVP] = useState<RSVPStatus | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [posterError, setPosterError] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Payment state
  const [showPWYCModal, setShowPWYCModal] = useState(false);
  const [pwycAmount, setPwycAmount] = useState("");
  const [showTestNotice, setShowTestNotice] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [demoNoticeSeen, setDemoNoticeSeen] = useState(false);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const isTestMode =
    typeof STRIPE_PUBLISHABLE_KEY === "string" &&
    STRIPE_PUBLISHABLE_KEY.startsWith("pk_test_");

  // Check if event has already started
  const eventHasStarted = event
    ? new Date(event.date).getTime() < new Date().getTime()
    : false;

  useEffect(() => {
    loadEvent();
    loadUserRSVP();

    // Scale and fade in animation on mount
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    // Read whether the demo notice was dismissed
    AsyncStorage.getItem("demo_payment_notice_dismissed").then((v) => {
      if (v === "1") setDemoNoticeSeen(true);
    });
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error("Failed to load event:", error);
      Alert.alert("Error", "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const loadUserRSVP = async () => {
    try {
      // Fetch user's RSVPs and find this event
      const response = await api.get("/me/rsvps");
      const eventRSVP = response.data.find(
        (rsvp: any) => rsvp.eventId === eventId
      );
      setUserRSVP(eventRSVP?.status || null);
    } catch (error) {
      console.error("Failed to load RSVP status:", error);
      // Don't show error - user might not have RSVP'd yet
    }
  };

  // Pull to refresh handler
  const onRefresh = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setRefreshing(true);
    await Promise.all([loadEvent(), loadUserRSVP()]);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setRefreshing(false);
  };

  /**
   * Handle payment flow for paid events
   */
  const handlePayment = async (amount: number) => {
    try {
      setRsvpLoading(true);

      // Create payment intent on backend
      const { clientSecret, amount: chargedAmount } = await createPaymentIntent(
        eventId,
        amount
      );

      // Initialize Stripe payment sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Scene Together",
        style: "automatic",
        googlePay: {
          merchantCountryCode: "GB",
          testEnv: __DEV__,
        },
        returnURL: "scenetogether://payment-complete",
      });

      if (initError) {
        console.error("Error initializing payment sheet:", initError);
        showToast("Failed to initialize payment", "error");
        return;
      }

      // Present payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === "Canceled") {
          showToast("Payment cancelled", "info");
        } else {
          console.error("Error presenting payment sheet:", presentError);
          showToast("Payment failed", "error");
        }
        return;
      }

      // Payment successful! Backend webhook will create RSVP
      // Reload to get updated status
      await Promise.all([loadEvent(), loadUserRSVP()]);

      // Show success feedback
      showToast(
        `Payment successful! £${(chargedAmount / 100).toFixed(2)} paid 🎉`,
        "success"
      );
      setShowConfetti(true);

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Prompt to add to calendar
      if (event) {
        setTimeout(async () => {
          try {
            const startDate = new Date(event.date);
            if (isNaN(startDate.getTime())) {
              console.error("Invalid event date");
              return;
            }

            // Assume 3 hour duration (typical movie + socializing)
            const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

            await promptAddToCalendar({
              title: event.title,
              startDate,
              endDate,
              location: event.location,
              notes: event.description
                ? `${event.description}\n\n${
                    event.movieData?.title
                      ? `Movie: ${event.movieData.title}`
                      : ""
                  }`
                : undefined,
            });
          } catch (error) {
            console.error("Calendar add error:", error);
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      showToast(error.message || "Payment failed", "error");
    } finally {
      setRsvpLoading(false);
      setShowPWYCModal(false);
      setPwycAmount("");
    }
  };

  // Wrapper that optionally shows a one-time test notice before running payment
  const requestPayment = async (amountCents: number) => {
    if (isTestMode && !demoNoticeSeen) {
      setPendingAmount(amountCents);
      setShowTestNotice(true);
      return;
    }
    await handlePayment(amountCents);
  };

  const handleRSVP = async (status: RSVPStatus) => {
    try {
      // Check if event has already started
      if (event && new Date(event.date).getTime() < new Date().getTime()) {
        Alert.alert(
          "Event Closed",
          "This event has already started and is no longer accepting RSVPs."
        );
        return;
      }

      // If going to a paid event, handle payment flow
      if (status === "going" && event) {
        const requiresPayment = event.price && event.price > 0;
        const isPWYC = event.payWhatYouCan;

        if (requiresPayment || isPWYC) {
          // If Pay What You Can, show amount input modal
          if (isPWYC) {
            setShowPWYCModal(true);
            return;
          }

          // Fixed price event - process payment
          if (event.price) {
            await requestPayment(event.price);
            return;
          }
        }
      }

      setRsvpLoading(true);

      // Premium haptic feedback on tap (native only)
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      // Toggle logic: if clicking the same status, remove RSVP
      if (userRSVP === status) {
        await api.delete(`/events/${eventId}/rsvp`);

        // Update local state
        setUserRSVP(null);

        // Reload event to get updated attendee count
        await loadEvent();

        // Show success toast
        showToast("RSVP removed", "success");
      } else {
        // Create or update RSVP (free events only)
        await api.post(`/events/${eventId}/rsvp`, { status });

        // Update local state
        setUserRSVP(status);

        // Reload event to get updated attendee count
        await loadEvent();

        // Show success toast
        const statusMessages = {
          going: "You're going! 🎉",
          interested: "Marked as interested ⭐",
          not_going: "RSVP removed",
        };
        showToast(statusMessages[status], "success");

        // Show confetti for "going" status
        if (status === "going") {
          setShowConfetti(true);
        }

        // If user is going, prompt to add to calendar
        if (status === "going" && event) {
          // Add small delay for better UX flow
          setTimeout(async () => {
            try {
              console.log("🗓️ Starting calendar add process...");
              console.log("Event data:", {
                date: event.date,
                title: event.title,
                location: event.location,
              });

              // Parse the date safely (use 'date' property from Event type)
              const startDate = new Date(event.date);

              // Validate the date is valid
              if (isNaN(startDate.getTime())) {
                console.error("❌ Invalid event date:", event.date);
                showToast("Invalid event date", "error");
                return;
              }

              console.log(
                "✅ Date parsed successfully:",
                startDate.toISOString()
              );

              // Assume 3 hour duration (typical movie + socializing)
              const endDate = new Date(
                startDate.getTime() + 3 * 60 * 60 * 1000
              );

              console.log("📅 Calling promptAddToCalendar...");
              const added = await promptAddToCalendar({
                title: event.title,
                startDate,
                endDate,
                location: event.location,
                notes: event.description
                  ? `${event.description}\n\n${
                      event.movieData?.title
                        ? `Movie: ${event.movieData.title}`
                        : ""
                    }`
                  : undefined,
              });

              console.log("📅 Calendar result:", added);

              if (added) {
                // Success! Alert is shown by the calendar service
                if (Platform.OS !== "web") {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                  );
                }
              } else {
                console.log("⚠️ User canceled or calendar failed");
              }
            } catch (error) {
              console.error("❌ Error adding to calendar:", error);
              // Show the error to user so we can debug
              showToast(`Calendar error: ${error}`, "error");
            }
          }, 500);
        }
      }

      // Success haptic feedback (native only)
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error: any) {
      console.error("Failed to RSVP:", error);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      // Show error message from API or generic error
      if (error.response?.data?.error === "Event is at full capacity") {
        showToast("Event is full! 😔", "error");
      } else {
        showToast("Failed to RSVP. Please try again.", "error");
      }
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleAddToCalendar = async () => {
    if (!event) return;

    try {
      // Haptic feedback (native only)
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const startDate = new Date(event.date);

      // Validate the date
      if (isNaN(startDate.getTime())) {
        showToast("Invalid event date", "error");
        return;
      }

      // Assume 3 hour duration (typical movie + socializing)
      const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

      const added = await promptAddToCalendar({
        title: event.title,
        startDate,
        endDate,
        location: event.location,
        notes: event.description
          ? `${event.description}\n\n${
              event.movieData?.title ? `Movie: ${event.movieData.title}` : ""
            }`
          : undefined,
      });

      if (added) {
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        // Show confetti on successful calendar add
        setShowConfetti(true);
      }
    } catch (error) {
      console.error("Error adding to calendar:", error);
      showToast("Failed to add to calendar", "error");
    }
  };

  const handleShare = async () => {
    if (!event) return;

    try {
      // Haptic feedback (native only)
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Format event details for sharing
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = eventDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      // Build share message
      let shareMessage = `${event.title}\n\n`;

      if (event.movieData?.title) {
        shareMessage += `Movie: ${event.movieData.title}\n`;
      }

      shareMessage += `Date: ${formattedDate}\n`;
      shareMessage += `Time: ${formattedTime}\n`;

      if (event.location) {
        shareMessage += `Location: ${event.location}\n`;
      }

      if (event.description) {
        shareMessage += `\n${event.description}\n`;
      }

      shareMessage += `\nJoin us at SceneTogether! 🍿`;

      // For web, use Web Share API if available, otherwise copy to clipboard
      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({
            title: event.title,
            text: shareMessage,
            url: window.location.href,
          });
          showToast("Shared successfully! 🎉", "success");
        } else {
          // Fallback: Copy to clipboard
          await navigator.clipboard.writeText(shareMessage);
          showToast("Event details copied to clipboard! 📋", "success");
        }
      } else {
        // Native sharing - use React Native's Share API
        const result = await Share.share({
          message: shareMessage,
          title: event.title,
        });

        if (result.action === Share.sharedAction) {
          showToast("Shared successfully! 🎉", "success");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error: any) {
      console.error("Error sharing event:", error);

      // Don't show error if user cancelled
      if (
        error?.message !== "User cancelled" &&
        error?.code !== "ERR_CANCELED"
      ) {
        showToast("Failed to share event", "error");
      }
    }
  };

  const handleOpenIMDB = async () => {
    if (!event?.movieData?.imdbId) {
      Alert.alert("No IMDB", "IMDB link not available for this film");
      return;
    }

    const imdbUrl = `https://www.imdb.com/title/${event.movieData.imdbId}`;

    try {
      const supported = await Linking.canOpenURL(imdbUrl);
      if (supported) {
        await Linking.openURL(imdbUrl);
      } else {
        Alert.alert("Error", "Cannot open IMDB URL");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open IMDB");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

  const getYouTubeVideoId = (url: string): string | null => {
    // Extract video ID from various YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Show error state only if not loading and no event
  if (!event && !loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  // If loading and no event yet, show minimal animated loading state
  if (!event) {
    return (
      <>
        <GradientBackground />
        <Animated.View
          style={{
            flex: 1,
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <View style={styles.centered}>
            <ActivityIndicator size="small" color={theme.colors.primaryLight} />
          </View>
        </Animated.View>
      </>
    );
  }

  // Parallax effect for hero image
  const heroTranslate = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, -100],
    extrapolate: "clamp",
  });

  const heroScale = scrollY.interpolate({
    inputRange: [-100, 0, 300],
    outputRange: [1.2, 1, 0.9],
    extrapolate: "clamp",
  });

  return (
    <>
      <GradientBackground />
      <Animated.View
        style={{
          flex: 1,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Animated.ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
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
          <View style={styles.contentWrapper}>
            {/* Hero Image with Gradient Overlay and Parallax */}
            {event.movieData?.poster && (
              <View style={styles.heroContainer}>
                {/* Poster wrapper with glow effect */}
                <Animated.View
                  style={[
                    styles.shadowWrapper,
                    {
                      transform: [
                        { translateY: heroTranslate },
                        { scale: heroScale },
                      ],
                    },
                  ]}
                >
                  <View style={styles.posterWrapper}>
                    {!posterError && event.movieData.poster ? (
                      <Image
                        source={{ uri: event.movieData.poster }}
                        style={styles.heroImage}
                        resizeMode="contain"
                        onError={() => setPosterError(true)}
                      />
                    ) : (
                      <PosterPlaceholder
                        title={event.movieData?.title || event.title}
                        style={styles.heroImage}
                        iconSize={150}
                      />
                    )}
                    <LinearGradient
                      colors={[
                        "transparent",
                        "rgba(10, 15, 20, 0.3)",
                        "rgba(10, 15, 20, 0.6)",
                      ]}
                      style={styles.posterGradient}
                    />
                  </View>
                </Animated.View>
              </View>
            )}

            {/* Content */}
            <View style={styles.content}>
              {/* Event Title */}
              <Text style={styles.title}>{event.title}</Text>

              {/* Description */}
              {event.description && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>About this event</Text>
                  <Text style={styles.description}>{event.description}</Text>
                </View>
              )}

              {/* Date & Time */}
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <CalendarIcon size={20} color={theme.colors.primary} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Date</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(event.date)}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <ClockIcon size={20} color={theme.colors.primary} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Time</Text>
                    <Text style={styles.infoValue}>
                      {formatTime(event.date)}
                    </Text>
                  </View>
                </View>

                {event.location && (
                  <View style={styles.infoRow}>
                    <MapPinIcon size={20} color={theme.colors.primary} />
                    <View style={styles.infoTextContainer}>
                      <Text style={styles.infoLabel}>Location</Text>
                      <Text style={styles.infoValue}>{event.location}</Text>
                    </View>
                  </View>
                )}

                {event.maxCapacity && (
                  <View style={styles.infoRow}>
                    <UsersIcon size={20} color={theme.colors.primary} />
                    <View style={styles.infoTextContainer}>
                      <Text style={styles.infoLabel}>Capacity</Text>
                      <Text style={styles.infoValue}>
                        {event.maxCapacity} spots
                      </Text>
                    </View>
                  </View>
                )}

                {/* Action Buttons Row */}
                <View style={styles.actionButtonsRow}>
                  <AnimatedButton
                    style={styles.actionButton}
                    onPress={handleAddToCalendar}
                  >
                    <CalendarIcon size={18} color={theme.colors.primary} />
                    <Text style={styles.actionButtonText}>Add to Calendar</Text>
                  </AnimatedButton>

                  <AnimatedButton
                    style={styles.actionButton}
                    onPress={handleShare}
                  >
                    <ShareIcon size={18} color={theme.colors.accent} />
                    <Text style={styles.actionButtonText}>Share Event</Text>
                  </AnimatedButton>
                </View>
              </View>

              {/* RSVP Section */}
              <View style={styles.rsvpSection}>
                <Text style={styles.rsvpTitle}>
                  {eventHasStarted ? "Event Status" : "Will you attend?"}
                </Text>

                {eventHasStarted ? (
                  <View style={styles.eventClosedContainer}>
                    <XCircleIcon
                      size={32}
                      color={theme.colors.text.secondary}
                    />
                    <Text style={styles.eventClosedText}>
                      This event has started and is no longer accepting RSVPs
                    </Text>
                  </View>
                ) : (
                  <View style={styles.rsvpButtons}>
                    {/* Going Button */}
                    <AnimatedButton
                      style={[
                        styles.rsvpOption,
                        userRSVP === "going" && styles.rsvpOptionActive,
                      ]}
                      onPress={() => handleRSVP("going")}
                      disabled={rsvpLoading}
                    >
                      <CheckCircleIcon
                        size={24}
                        color={
                          userRSVP === "going"
                            ? theme.colors.text.inverse
                            : theme.colors.success
                        }
                      />
                      <Text
                        style={[
                          styles.rsvpOptionText,
                          userRSVP === "going" && styles.rsvpOptionTextActive,
                        ]}
                      >
                        Going
                      </Text>
                    </AnimatedButton>

                    {/* Interested Button */}
                    <AnimatedButton
                      style={[
                        styles.rsvpOption,
                        userRSVP === "interested" && styles.rsvpOptionActive,
                      ]}
                      onPress={() => handleRSVP("interested")}
                      disabled={rsvpLoading}
                    >
                      <StarIcon
                        size={24}
                        color={
                          userRSVP === "interested"
                            ? theme.colors.text.inverse
                            : theme.colors.warning
                        }
                      />
                      <Text
                        style={[
                          styles.rsvpOptionText,
                          userRSVP === "interested" &&
                            styles.rsvpOptionTextActive,
                        ]}
                      >
                        Interested
                      </Text>
                    </AnimatedButton>

                    {/* Not Going Button */}
                    {userRSVP && (
                      <AnimatedButton
                        style={[
                          styles.rsvpOption,
                          userRSVP === "not_going" && styles.rsvpOptionActive,
                        ]}
                        onPress={() => handleRSVP("not_going")}
                        disabled={rsvpLoading}
                      >
                        <XCircleIcon
                          size={24}
                          color={
                            userRSVP === "not_going"
                              ? theme.colors.text.inverse
                              : theme.colors.error
                          }
                        />
                        <Text
                          style={[
                            styles.rsvpOptionText,
                            userRSVP === "not_going" &&
                              styles.rsvpOptionTextActive,
                          ]}
                        >
                          Can't Go
                        </Text>
                      </AnimatedButton>
                    )}
                  </View>
                )}

                {!eventHasStarted && rsvpLoading && (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primaryLight}
                    style={styles.rsvpLoader}
                  />
                )}

                {/* Attendee Count and Capacity */}
                {event.maxCapacity && (
                  <View style={styles.attendeeInfo}>
                    <UsersIcon size={16} color={theme.colors.primary} />
                    <Text style={styles.attendeeInfoText}>
                      {event.attendeeCount || 0} / {event.maxCapacity} spots
                      taken
                    </Text>
                  </View>
                )}
              </View>

              {/* Movie Details */}
              {event.movieData && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>About the film</Text>
                  <Text style={styles.movieTitle}>{event.movieData.title}</Text>

                  {/* Movie Info Badges Row - moved directly below title */}
                  <View style={styles.movieMetaRow}>
                    {event.movieData.year && (
                      <View style={styles.metaChip}>
                        <CalendarIcon
                          size={12}
                          color={theme.colors.text.inverse}
                        />
                        <Text style={styles.metaChipText}>
                          {event.movieData.year}
                        </Text>
                      </View>
                    )}
                    {event.movieData.runtime && (
                      <View style={styles.metaChip}>
                        <ClockIcon
                          size={12}
                          color={theme.colors.text.inverse}
                        />
                        <Text style={styles.metaChipText}>
                          {event.movieData.runtime}
                        </Text>
                      </View>
                    )}
                    {event.movieData.imdbRating && (
                      <View style={styles.metaChip}>
                        <StarIcon size={12} color={theme.colors.text.inverse} />
                        <Text style={styles.metaChipText}>
                          {parseFloat(event.movieData.imdbRating).toFixed(1)}/10
                        </Text>
                      </View>
                    )}
                  </View>

                  {event.movieData.plot && (
                    <Text style={styles.moviePlot}>{event.movieData.plot}</Text>
                  )}

                  {/* Genre Chips */}
                  {event.movieData.genre && (
                    <View style={styles.genreSection}>
                      <Text style={styles.movieMetaLabel}>Genres:</Text>
                      <View style={styles.genreChipsContainer}>
                        {event.movieData.genre
                          .split(",")
                          .map((genre, index) => {
                            const trimmedGenre = genre.trim();
                            return (
                              <View
                                key={index}
                                style={[
                                  styles.genreChip,
                                  {
                                    backgroundColor:
                                      getGenreColor(trimmedGenre),
                                  },
                                ]}
                              >
                                <Text style={styles.genreChipText}>
                                  {trimmedGenre}
                                </Text>
                              </View>
                            );
                          })}
                      </View>
                    </View>
                  )}

                  {event.movieData.director && (
                    <Text style={styles.movieMeta}>
                      <Text style={styles.movieMetaLabel}>Director: </Text>
                      {event.movieData.director}
                    </Text>
                  )}
                  {event.movieData.actors && (
                    <Text style={styles.movieMeta}>
                      <Text style={styles.movieMetaLabel}>Cast: </Text>
                      {event.movieData.actors}
                    </Text>
                  )}

                  {/* IMDB Button */}
                  {event.movieData?.imdbId && (
                    <View style={styles.actionButtons}>
                      <AnimatedButton
                        style={styles.imdbButton}
                        onPress={handleOpenIMDB}
                      >
                        <FilmIcon size={20} color={theme.colors.primary} />
                        <Text style={styles.imdbButtonText}>View on IMDB</Text>
                      </AnimatedButton>
                    </View>
                  )}

                  {/* Embedded YouTube Trailer */}
                  {event.movieData.trailer &&
                    (() => {
                      const videoId = getYouTubeVideoId(
                        event.movieData.trailer
                      );
                      if (videoId) {
                        return (
                          <View style={styles.trailerContainer}>
                            <View style={styles.trailerTitleRow}>
                              <FilmIcon
                                size={18}
                                color={theme.colors.text.primary}
                              />
                              <Text style={styles.trailerTitle}>
                                Watch Trailer
                              </Text>
                            </View>

                            {Platform.OS === "web" ? (
                              // Web: Use iframe directly with 16:9 aspect ratio
                              <View style={styles.videoWrapper}>
                                <View style={styles.videoAspectRatio}>
                                  <iframe
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      border: 0,
                                      borderRadius: 12,
                                    }}
                                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </View>
                              </View>
                            ) : (
                              // Mobile: Use WebView
                              <View style={styles.videoWrapper}>
                                <WebView
                                  style={styles.video}
                                  source={{
                                    html: `
                              <!DOCTYPE html>
                              <html>
                                <head>
                                  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                                  <style>
                                    * { margin: 0; padding: 0; }
                                    body { background: #000; }
                                    .container { position: relative; width: 100%; padding-bottom: 56.25%; }
                                    iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
                                  </style>
                                </head>
                                <body>
                                  <div class="container">
                                    <iframe 
                                      src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
                                      allowfullscreen
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    ></iframe>
                                  </div>
                                </body>
                              </html>
                            `,
                                  }}
                                  allowsFullscreenVideo
                                  javaScriptEnabled
                                  domStorageEnabled
                                  mediaPlaybackRequiresUserAction={false}
                                />
                              </View>
                            )}
                          </View>
                        );
                      }
                      return null;
                    })()}
                </View>
              )}
            </View>
          </View>
        </Animated.ScrollView>

        {/* Sticky Bottom RSVP/Payment Bar */}
        {!eventHasStarted && event && (
          <View style={styles.stickyBottomBar}>
            <View style={styles.bottomBarContent}>
              {/* Price Info */}
              <View style={styles.priceInfo}>
                {event.payWhatYouCan ? (
                  <>
                    <Text style={styles.priceLabel}>PWYC</Text>
                    <Text style={styles.priceSubtext}>
                      Min £{((event.minPrice || 0) / 100).toFixed(2)}
                    </Text>
                  </>
                ) : event.price && event.price > 0 ? (
                  <>
                    <Text style={styles.priceLabel}>
                      £{(event.price / 100).toFixed(2)}
                    </Text>
                    <Text style={styles.priceSubtext}>per person</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.priceLabel}>Free</Text>
                    <Text style={styles.priceSubtext}>
                      {event.attendeeCount || 0}/{event.maxCapacity} attending
                    </Text>
                  </>
                )}
              </View>

              {/* Primary Action Button */}
              <AnimatedButton
                style={[
                  styles.stickyRsvpButton,
                  userRSVP === "going" && styles.stickyRsvpButtonActive,
                ]}
                onPress={() =>
                  handleRSVP(userRSVP === "going" ? "not_going" : "going")
                }
                disabled={rsvpLoading}
              >
                {rsvpLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.text.inverse}
                  />
                ) : (
                  <>
                    {userRSVP === "going" ? (
                      <>
                        <CheckCircleIcon
                          size={20}
                          color={theme.colors.text.inverse}
                        />
                        <Text style={styles.stickyButtonText}>
                          You're Going!
                        </Text>
                      </>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <TicketIcon
                          size={20}
                          color={theme.colors.text.inverse}
                        />
                        <Text style={styles.stickyButtonText}>
                          {event.price && event.price > 0
                            ? event.payWhatYouCan
                              ? "Choose Amount & RSVP"
                              : `Pay £${(event.price / 100).toFixed(2)} & RSVP`
                            : "RSVP Free"}
                        </Text>
                        {STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_") && (
                          <TouchableOpacity
                            onPress={() => setShowTestNotice(true)}
                            style={{ padding: 2 }}
                          >
                            <InformationCircleIcon
                              size={18}
                              color={theme.colors.text.inverse}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </>
                )}
              </AnimatedButton>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Success Confetti */}
      <SuccessConfetti
        visible={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Pay What You Can Modal */}
      <Modal
        visible={showPWYCModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPWYCModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pay What You Can</Text>
            <Text style={styles.modalSubtitle}>
              Minimum: £{((event?.minPrice || 0) / 100).toFixed(2)}
            </Text>

            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>£</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={theme.colors.text.tertiary}
                keyboardType="decimal-pad"
                value={pwycAmount}
                onChangeText={(text) => {
                  // Only allow numbers and decimal point
                  const cleaned = text.replace(/[^0-9.]/g, "");
                  // Only allow one decimal point
                  const parts = cleaned.split(".");
                  if (parts.length > 2) return;
                  setPwycAmount(cleaned);
                }}
                autoFocus
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowPWYCModal(false);
                  setPwycAmount("");
                }}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <AnimatedButton
                style={styles.modalConfirmButton}
                onPress={() => {
                  const amountInPounds = parseFloat(pwycAmount);
                  if (isNaN(amountInPounds) || amountInPounds <= 0) {
                    showToast("Please enter a valid amount", "error");
                    return;
                  }

                  const amountInCents = Math.round(amountInPounds * 100);
                  const minPrice = event?.minPrice || 0;

                  if (amountInCents < minPrice) {
                    showToast(
                      `Amount must be at least £${(minPrice / 100).toFixed(2)}`,
                      "error"
                    );
                    return;
                  }

                  requestPayment(amountInCents);
                }}
                disabled={rsvpLoading}
              >
                {rsvpLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.text.inverse}
                  />
                ) : (
                  <>
                    <CreditCardIcon
                      size={20}
                      color={theme.colors.text.inverse}
                    />
                    <Text style={styles.modalConfirmButtonText}>
                      Continue to Payment
                    </Text>
                  </>
                )}
              </AnimatedButton>
            </View>
          </View>
        </View>
      </Modal>
      {/* Demo/Test Payment Notice */}
      <Modal
        visible={showTestNotice}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTestNotice(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Demo payment</Text>
            <Text style={styles.modalSubtitle}>
              This app is in Test Mode. Use Stripe test cards only.
            </Text>

            <View style={styles.testCardsContainer}>
              <Text style={styles.sectionTitle}>Common test cards</Text>
              <View style={{ gap: 12 }}>
                <View style={styles.testCardRow}>
                  <Text style={styles.testCardNumber}>4242 4242 4242 4242</Text>
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        await Clipboard.setStringAsync("4242424242424242");
                        showToast("Card copied!", "success");
                      } catch (_) {
                        showToast("Copy failed", "error");
                      }
                    }}
                    style={styles.copyChip}
                  >
                    <Text style={styles.copyChipText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.testCardHint}>
                  Expiry: any future, CVC: 123
                </Text>
                <View style={styles.testCardRow}>
                  <Text style={styles.testCardNumber}>4000 0027 6000 3184</Text>
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        await Clipboard.setStringAsync("4000002760003184");
                        showToast("Card copied!", "success");
                      } catch (_) {
                        showToast("Copy failed", "error");
                      }
                    }}
                    style={styles.copyChip}
                  >
                    <Text style={styles.copyChipText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.testCardHint}>(3D Secure test)</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => setDontShowAgain((v) => !v)}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: theme.colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8,
                }}
              >
                {dontShowAgain && (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: theme.colors.primary,
                    }}
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.description}>Don’t show again</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowTestNotice(false);
                  setPendingAmount(null);
                }}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <AnimatedButton
                style={styles.modalConfirmButton}
                onPress={async () => {
                  if (dontShowAgain) {
                    await AsyncStorage.setItem(
                      "demo_payment_notice_dismissed",
                      "1"
                    );
                    setDemoNoticeSeen(true);
                  }
                  const amount = pendingAmount;
                  setShowTestNotice(false);
                  setPendingAmount(null);
                  if (typeof amount === "number") {
                    await handlePayment(amount);
                  }
                }}
              >
                <Text style={styles.modalConfirmButtonText}>Continue</Text>
              </AnimatedButton>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 120, // Space for sticky bottom bar
  },
  contentWrapper: {
    width: "100%",
    maxWidth: theme.layout.maxWidth,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
  },
  heroContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxs,
  },
  shadowWrapper: {
    width: Platform.OS === "web" ? "70%" : "85%", // Smaller on web, perfect on mobile
    aspectRatio: 2 / 3,
    alignSelf: "center",
    borderRadius: theme.components.radii.poster,
    ...getPlatformGlow("strong"),
  },
  posterWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: theme.components.radii.poster,
    borderWidth: 2,
    borderColor: theme.components.borders.strong,
    overflow: "hidden",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  posterGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  content: {
    padding: theme.spacing.base,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    lineHeight: theme.typography.fontSize.xxxl * 1.2,
  },
  infoCard: {
    ...getCardStyle(),
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xxs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  actionButtonsRow: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
    ...(Platform.OS === "web" && {
      justifyContent: "space-between",
    }),
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.components.surfaces.section,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    flex: Platform.OS === "web" ? 1 : undefined,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }
      : theme.shadows.sm),
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  section: {
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
  description: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.base * 1.5,
  },
  movieTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  moviePlot: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.sm * 1.6,
    marginBottom: theme.spacing.md,
  },
  movieMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: theme.spacing.md,
    marginHorizontal: -theme.spacing.xs,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }
      : theme.shadows.sm),
  },
  metaChipText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: 0.5,
    marginLeft: theme.spacing.xs,
  },
  movieMeta: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.fontSize.sm * 1.5,
  },
  movieMetaLabel: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  genreSection: {
    marginBottom: theme.spacing.md,
  },
  genreChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: theme.spacing.sm,
    marginHorizontal: -theme.spacing.xs,
  },
  genreChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }
      : theme.shadows.md),
  },
  genreChipText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  trailerContainer: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  trailerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  trailerTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  videoWrapper: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    backgroundColor: "#000",
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }
      : theme.shadows.md),
  },
  videoAspectRatio: {
    position: "relative",
    width: "100%",
    paddingBottom: "56.25%", // 16:9 aspect ratio
  },
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  rsvpSection: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  rsvpTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  rsvpButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    marginHorizontal: Platform.OS === "web" ? "auto" : 0,
    maxWidth: Platform.OS === "web" ? 600 : "100%",
    paddingHorizontal: theme.spacing.md,
  },
  eventClosedContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xl,
    backgroundColor: theme.components.surfaces.section,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    marginHorizontal: theme.spacing.md,
  },
  eventClosedText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  rsvpOption: {
    width: 110,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.components.surfaces.section,
    borderWidth: 2,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    marginHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }
      : theme.shadows.sm),
  },
  rsvpOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  rsvpOptionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
  rsvpOptionTextActive: {
    color: theme.colors.text.inverse,
  },
  rsvpLoader: {
    marginVertical: theme.spacing.sm,
  },
  attendeeInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: "rgba(21, 28, 35, 0.8)",
    borderWidth: 1,
    borderColor: theme.components.borders.subtle,
    borderRadius: theme.borderRadius.lg,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)" }
      : theme.shadows.md),
  },
  attendeeInfoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: theme.spacing.xs,
  },
  actionButtons: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  imdbButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.components.surfaces.section,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }
      : theme.shadows.sm),
  },
  imdbButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: theme.spacing.sm,
  },
  // Sticky Bottom Bar Styles
  stickyBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  bottomBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  priceInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  priceLabel: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  priceSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  stickyRsvpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    minWidth: 180,
    gap: theme.spacing.sm,
    ...getPlatformGlow("strong"),
  },
  stickyRsvpButtonActive: {
    backgroundColor: theme.colors.success,
    ...getPlatformGlow("strong"),
  },
  stickyButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
  },
  // PWYC Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  modalContent: {
    backgroundColor: theme.components.surfaces.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    ...getPlatformGlow("strong"),
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.components.surfaces.section,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  currencySymbol: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    padding: 0,
  },
  modalButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.components.surfaces.section,
    borderWidth: 1,
    borderColor: theme.components.borders.default,
    alignItems: "center",
  },
  modalCancelButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },
  modalConfirmButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    ...getPlatformGlow("strong"),
  },
  modalConfirmButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  copyChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  copyChipText: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 12,
  },
  testCardsContainer: {
    ...getCardStyle(),
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    overflow: "hidden",
  },
  testCardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  testCardNumber: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  testCardHint: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    opacity: 0.7,
  },
  testModeBanner: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 24,
    left: 0,
    right: 0,
    zIndex: 200,
    alignItems: "center",
    paddingVertical: 6,
    backgroundColor: "rgba(234,179,8,0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.15)",
  },
  testModeText: {
    color: "#1b1b1b",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
