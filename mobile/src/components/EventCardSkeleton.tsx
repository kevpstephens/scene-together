import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme";

export default function EventCardSkeleton() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View style={styles.card}>
      {/* Poster skeleton */}
      <View style={styles.posterContainer}>
        <View style={styles.posterSkeleton}>
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.3)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shimmerGradient}
            />
          </Animated.View>
        </View>
      </View>

      {/* Content skeleton */}
      <View style={styles.cardContent}>
        {/* Date tag skeleton */}
        <View style={styles.dateTagSkeleton} />

        {/* Title skeleton */}
        <View style={styles.titleSkeleton} />
        <View style={[styles.titleSkeleton, { width: "60%" }]} />

        {/* Details skeleton */}
        <View style={styles.detailSkeleton} />
        <View style={styles.detailSkeleton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.lg,
    overflow: "hidden",
    // Web-compatible shadow
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.16)",
        }
      : theme.shadows.lg),
  },
  posterContainer: {
    width: "100%",
    height: 240,
  },
  posterSkeleton: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.borderLight,
    overflow: "hidden",
  },
  shimmer: {
    width: "100%",
    height: "100%",
  },
  shimmerGradient: {
    width: 300,
    height: "100%",
  },
  cardContent: {
    padding: theme.spacing.base,
  },
  dateTagSkeleton: {
    width: 100,
    height: 24,
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.sm,
  },
  titleSkeleton: {
    width: "100%",
    height: 20,
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  detailSkeleton: {
    width: "80%",
    height: 16,
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
});
