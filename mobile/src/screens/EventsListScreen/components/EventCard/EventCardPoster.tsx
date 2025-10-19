import React from "react";
import { View, Image, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../EventsListScreen.styles";
import PosterPlaceholder from "../../../../components/PosterPlaceholder";
import type { Event } from "../../../../types";

interface PriceInfo {
  label: string;
  color: string;
}

interface EventCardPosterProps {
  event: Event;
  failedPosters: Record<string, boolean>;
  priceInfo: PriceInfo | null;
  onPosterError: (eventId: string) => void;
}

export const EventCardPoster: React.FC<EventCardPosterProps> = ({
  event,
  failedPosters,
  priceInfo,
  onPosterError,
}) => {
  return (
    <View style={styles.posterContainer}>
      {event.movieData?.poster && !failedPosters[event.id] ? (
        <Image
          source={{ uri: event.movieData.poster }}
          style={styles.poster}
          resizeMode="cover"
          onError={() => {
            console.log("Poster failed to load for event:", event.id);
            onPosterError(event.id);
          }}
        />
      ) : (
        <PosterPlaceholder
          title={event.movieData?.title || event.title}
          style={styles.poster}
          iconSize={120}
        />
      )}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        style={styles.posterGradient}
      />

      {priceInfo && (
        <View style={styles.priceBadgeOnPoster}>
          <LinearGradient
            colors={
              priceInfo.label === "FREE"
                ? [`${priceInfo.color}F0`, `${priceInfo.color}D9`]
                : [
                    `${priceInfo.color}F0`,
                    `${priceInfo.color}CC`,
                    `${priceInfo.color}E6`,
                  ]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.priceBadgeGradient,
              { borderColor: `${priceInfo.color}` },
            ]}
          >
            <Text style={[styles.priceTextOnPoster, { color: "#FFFFFF" }]}>
              {priceInfo.label}
            </Text>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};
