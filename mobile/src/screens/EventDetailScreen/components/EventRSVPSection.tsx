import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { CheckCircleIcon, StarIcon, XCircleIcon, UsersIcon } from "react-native-heroicons/outline";
import AnimatedButton from "../../../components/AnimatedButton";
import { theme } from "../../../theme";
import { styles } from "../EventDetailScreen.styles";
import type { Event, RSVPStatus } from "../../../types";

interface EventRSVPSectionProps {
  event: Event;
  eventHasStarted: boolean;
  userRSVP: RSVPStatus | null;
  rsvpLoading: boolean;
  onRSVP: (status: RSVPStatus) => void;
}

export const EventRSVPSection: React.FC<EventRSVPSectionProps> = ({
  event,
  eventHasStarted,
  userRSVP,
  rsvpLoading,
  onRSVP,
}) => {
  return (
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
            onPress={() => onRSVP("going")}
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
            onPress={() => onRSVP("interested")}
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
              onPress={() => onRSVP("not_going")}
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
  );
};

