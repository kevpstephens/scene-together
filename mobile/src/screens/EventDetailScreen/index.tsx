/*===============================================
 * Event Detail Screen
 * ==============================================
 * Comprehensive event details with RSVP and payment functionality.
 * Features:
 * - Movie data integration (poster, trailer, metadata)
 * - Stripe payment flow with pay-what-you-can option
 * - RSVP management with calendar integration
 * - AsyncStorage caching for optimistic UI
 * - Client-side payment sync as webhook fallback
 * - Share and external link actions
 * ==============================================
 */

import React, { useState } from "react";
import { View, Text, Animated, RefreshControl } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { EventsStackParamList } from "../../navigation/types";
import GradientBackground from "../../components/GradientBackground";
import SuccessConfetti from "../../components/SuccessConfetti";
import { theme } from "../../theme";
import { styles } from "./EventDetailScreen.styles";
import { useToast } from "../../contexts/toast";
import {
  useEventAnimation,
  useEventData,
  useEventPayment,
  useEventRSVP,
  useEventActions,
} from "./hooks";
import {
  PWYCModal,
  TestNoticeModal,
  EventHeader,
  EventDescription,
  EventInfoCard,
  EventActionButtons,
  EventRSVPSection,
  MovieDataSection,
  StickyBottomBar,
} from "./components";

// Declare iframe for React Native Web
declare global {
  namespace JSX {
    interface IntrinsicElements {
      iframe: any;
    }
  }
}

type RouteProps = RouteProp<EventsStackParamList, "EventDetail">;

export default function EventDetailScreen() {
  const route = useRoute<RouteProps>();
  const { eventId } = route.params;
  const { showToast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);

  // Custom hooks
  const { scrollY, scaleAnim, opacityAnim } = useEventAnimation();

  const {
    event,
    loading,
    userRSVP,
    refreshing,
    posterError,
    setPosterError,
    setUserRSVP,
    onRefresh,
    loadEvent,
    loadUserRSVP,
    eventHasStarted,
    demoNoticeSeen,
  } = useEventData(eventId);

  const {
    rsvpLoading: paymentLoading,
    showPWYCModal,
    setShowPWYCModal,
    pwycAmount,
    setPwycAmount,
    showTestNotice,
    setShowTestNotice,
    dontShowAgain,
    setDontShowAgain,
    isTestMode,
    requestPayment,
    handleDismissTestNotice,
  } = useEventPayment({
    eventId,
    event,
    demoNoticeSeen,
    loadEvent,
    loadUserRSVP,
    onPaymentSuccess: () => setShowConfetti(true),
  });

  const { rsvpLoading, handleRSVP } = useEventRSVP({
    eventId,
    event,
    userRSVP,
    setUserRSVP,
    loadEvent,
    requestPayment,
    setShowPWYCModal,
    onRSVPSuccess: () => setShowConfetti(true),
  });

  const { handleShare, handleOpenIMDB, handleAddToCalendar } = useEventActions({
    event,
    onSuccess: () => setShowConfetti(true),
  });

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
          {event && (
            <View style={styles.contentWrapper}>
              {/* Hero Image with Parallax */}
              <EventHeader
                event={event}
                posterError={posterError}
                onPosterError={() => setPosterError(true)}
                heroTranslate={heroTranslate}
                heroScale={heroScale}
              />

              {/* Content */}
              <View style={styles.content}>
                {/* Event Title */}
                <Text style={styles.title}>{event.title}</Text>

                {/* Description */}
                <EventDescription description={event.description} />

                {/* Date & Time */}
                <EventInfoCard event={event}>
                  <EventActionButtons
                    onAddToCalendar={handleAddToCalendar}
                    onShare={handleShare}
                  />
                </EventInfoCard>

                {/* RSVP Section */}
                <EventRSVPSection
                  event={event}
                  eventHasStarted={eventHasStarted}
                  userRSVP={userRSVP}
                  rsvpLoading={rsvpLoading}
                  onRSVP={handleRSVP}
                />

                {/* Movie Details */}
                <MovieDataSection
                  movieData={event.movieData}
                  onOpenIMDB={handleOpenIMDB}
                />
              </View>
            </View>
          )}
        </Animated.ScrollView>

        {/* Sticky Bottom RSVP/Payment Bar */}
        {event && (
          <StickyBottomBar
            event={event}
            eventHasStarted={eventHasStarted}
            userRSVP={userRSVP}
            rsvpLoading={rsvpLoading}
            isTestMode={isTestMode}
            onRSVP={handleRSVP}
            onShowTestNotice={() => setShowTestNotice(true)}
          />
        )}
      </Animated.View>

      {/* Success Confetti */}
      <SuccessConfetti
        visible={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Modals */}
      {event && (
        <PWYCModal
          visible={showPWYCModal}
          event={event}
          rsvpLoading={rsvpLoading}
          onClose={() => setShowPWYCModal(false)}
          onConfirm={requestPayment}
          showToast={showToast}
        />
      )}

      <TestNoticeModal
        visible={showTestNotice}
        dontShowAgain={dontShowAgain}
        onDontShowAgainChange={setDontShowAgain}
        onClose={() => {
          setShowTestNotice(false);
        }}
        onConfirm={handleDismissTestNotice}
        showToast={showToast}
      />
    </>
  );
}
