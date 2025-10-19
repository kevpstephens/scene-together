import React from "react";
import { View, Text } from "react-native";
import { ClockIcon, MapPinIcon } from "react-native-heroicons/solid";
import { theme } from "../../../../theme";
import { styles } from "../../EventsListScreen.styles";
import { getGenreColor, formatTime } from "../../utils";
import type { Event } from "../../../../types";

interface EventCardDetailsProps {
  event: Event;
}

/**
 * Event card details section with title, time, location, and movie info
 */
export const EventCardDetails: React.FC<EventCardDetailsProps> = ({
  event,
}) => {
  return (
    <>
      <Text style={styles.title} numberOfLines={2}>
        {event.title}
      </Text>

      {/* Time and Location Row */}
      <View style={styles.timeLocationRow}>
        <View style={styles.timeContainer}>
          <ClockIcon size={16} color={theme.colors.primaryLight} />
          <Text style={styles.time}>{formatTime(event.date)}</Text>
        </View>
        {event.location && (
          <>
            <Text style={styles.dotSeparator}>•</Text>
            <View style={styles.locationContainer}>
              <MapPinIcon size={16} color={theme.colors.primaryLight} />
              <Text style={styles.location}>{event.location}</Text>
            </View>
          </>
        )}
      </View>

      {event.movieData && (
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={1}>
            {event.movieData.title}
          </Text>
          {event.movieData.genre && (
            <View style={styles.genreContainer}>
              {event.movieData.genre
                .split(",")
                .slice(0, 3)
                .map((genre, index) => {
                  const trimmedGenre = genre.trim();
                  return (
                    <View
                      key={index}
                      style={[
                        styles.genreChip,
                        { backgroundColor: getGenreColor(trimmedGenre) },
                      ]}
                    >
                      <Text style={styles.genreChipText} numberOfLines={1}>
                        {trimmedGenre}
                      </Text>
                    </View>
                  );
                })}
            </View>
          )}
        </View>
      )}
    </>
  );
};
