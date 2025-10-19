import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  PencilSquareIcon,
  TrashIcon,
  UsersIcon,
  MapPinIcon,
} from "react-native-heroicons/solid";
import { theme } from "../../../../theme";
import { styles } from "../AdminEventsScreen.styles";
import { formatDate, isPastEvent } from "../utils";
import type { Event } from "../../../../types";

interface EventCardProps {
  event: Event;
  isDeleting: boolean;
  onNavigateAttendees: () => void;
  onNavigateEdit: () => void;
  onDelete: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isDeleting,
  onNavigateAttendees,
  onNavigateEdit,
  onDelete,
}) => {
  const past = isPastEvent(event.date);
  const fillPercentage = event.maxCapacity
    ? ((event.attendeeCount || 0) / event.maxCapacity) * 100
    : 0;

  return (
    <View style={[styles.card, past && styles.cardPast]}>
      <View style={styles.cardHeader}>
        {event.movieData?.poster && (
          <Image
            source={{ uri: event.movieData.poster }}
            style={styles.poster}
            resizeMode="cover"
          />
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {event.title}
          </Text>
          {event.movieData?.title && (
            <Text style={styles.cardMovie} numberOfLines={1}>
              {event.movieData.title}
            </Text>
          )}
          <Text style={styles.cardDate}>{formatDate(event.date)}</Text>
          <View style={styles.cardLocationContainer}>
            <MapPinIcon size={14} color={theme.colors.text.secondary} />
            <Text style={styles.cardLocation} numberOfLines={1}>
              {event.location}
            </Text>
          </View>

          {/* Capacity */}
          {event.maxCapacity && (
            <View style={styles.capacityContainer}>
              <Text style={styles.capacityText}>
                {event.attendeeCount || 0} / {event.maxCapacity} spots
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${fillPercentage}%`,
                      backgroundColor:
                        fillPercentage >= 90
                          ? theme.colors.error
                          : fillPercentage >= 70
                            ? theme.colors.warning
                            : theme.colors.accent,
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonPrimary]}
          onPress={onNavigateAttendees}
        >
          <UsersIcon size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Attendees</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={onNavigateEdit}
        >
          <PencilSquareIcon size={16} color={theme.colors.primary} />
          <Text
            style={[styles.actionButtonText, styles.actionButtonTextSecondary]}
          >
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.actionButtonDanger,
            isDeleting && styles.actionButtonDisabled,
          ]}
          onPress={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color={theme.colors.error} />
          ) : (
            <>
              <TrashIcon size={16} color={theme.colors.error} />
              <Text
                style={[styles.actionButtonText, styles.actionButtonTextDanger]}
              >
                Delete
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
