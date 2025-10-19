import React from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import {
  CheckCircleIcon,
  TicketIcon,
  InformationCircleIcon,
} from "react-native-heroicons/outline";
import AnimatedButton from "../../../components/AnimatedButton";
import { theme } from "../../../theme";
import { styles } from "../EventDetailScreen.styles";
import type { Event, RSVPStatus } from "../../../types";

interface StickyBottomBarProps {
  event: Event;
  eventHasStarted: boolean;
  userRSVP: RSVPStatus | null;
  rsvpLoading: boolean;
  isTestMode: boolean;
  onRSVP: (status: RSVPStatus) => void;
  onShowTestNotice: () => void;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
  event,
  eventHasStarted,
  userRSVP,
  rsvpLoading,
  isTestMode,
  onRSVP,
  onShowTestNotice,
}) => {
  if (eventHasStarted) {
    return null;
  }

  return (
    <View style={styles.stickyBottomBar}>
      <View style={styles.bottomBarContent}>
        {/* Price Info */}
        <View style={styles.priceInfo}>
          {event.payWhatYouCan ? (
            <>
              <Text style={styles.priceLabel} numberOfLines={1}>
                PWYC
              </Text>
              <Text style={styles.priceSubtext} numberOfLines={1}>
                Min £{((event.minPrice || 0) / 100).toFixed(2)}
              </Text>
            </>
          ) : event.price && event.price > 0 ? (
            <>
              <Text style={styles.priceLabel} numberOfLines={1}>
                £{(event.price / 100).toFixed(2)}
              </Text>
              <Text style={styles.priceSubtext} numberOfLines={1}>
                per person
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.priceLabel} numberOfLines={1}>
                Free
              </Text>
              <Text style={styles.priceSubtext} numberOfLines={1}>
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
          onPress={() => onRSVP(userRSVP === "going" ? "not_going" : "going")}
          disabled={rsvpLoading}
        >
          {rsvpLoading ? (
            <ActivityIndicator size="small" color={theme.colors.text.inverse} />
          ) : (
            <>
              {userRSVP === "going" ? (
                <>
                  <CheckCircleIcon
                    size={20}
                    color={theme.colors.text.inverse}
                  />
                  <Text style={styles.stickyButtonText}>You're Going!</Text>
                </>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <TicketIcon size={20} color={theme.colors.text.inverse} />
                  <Text style={styles.stickyButtonText}>
                    {event.price && event.price > 0
                      ? event.payWhatYouCan
                        ? "Choose Amount & RSVP"
                        : `Pay £${(event.price / 100).toFixed(2)} & RSVP`
                      : "RSVP Free"}
                  </Text>
                  {isTestMode && (
                    <TouchableOpacity
                      onPress={onShowTestNotice}
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
  );
};
