import React from "react";
import { View, Image, Animated, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PosterPlaceholder from "../../../components/PosterPlaceholder";
import { styles } from "../EventDetailScreen.styles";
import type { Event } from "../../../types";

interface EventHeaderProps {
  event: Event;
  posterError: boolean;
  onPosterError: () => void;
  heroTranslate: Animated.AnimatedInterpolation<number>;
  heroScale: Animated.AnimatedInterpolation<number>;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  posterError,
  onPosterError,
  heroTranslate,
  heroScale,
}) => {
  if (!event.movieData?.poster) {
    return null;
  }

  return (
    <View style={styles.heroContainer}>
      {/* Poster wrapper with glow effect */}
      <Animated.View
        style={[
          styles.shadowWrapper,
          {
            transform: [{ translateY: heroTranslate }, { scale: heroScale }],
          },
        ]}
      >
        <View style={styles.posterWrapper}>
          {/* Extra clipping wrapper for web */}
          <View
            style={
              Platform.OS === "web"
                ? {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflow: "hidden",
                    borderRadius: 12,
                  }
                : undefined
            }
          >
            {!posterError && event.movieData.poster ? (
              <Image
                source={{ uri: event.movieData.poster }}
                style={styles.heroImage}
                resizeMode="cover"
                onError={onPosterError}
              />
            ) : (
              <PosterPlaceholder
                title={event.movieData?.title || event.title}
                style={styles.heroImage}
                iconSize={150}
              />
            )}
          </View>
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
  );
};
