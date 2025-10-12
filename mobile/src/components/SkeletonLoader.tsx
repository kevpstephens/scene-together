import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, ViewStyle, Platform } from "react-native";
import { theme } from "../theme";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export default function SkeletonLoader({
  width = "100%",
  height = 20,
  borderRadius = theme.borderRadius.md,
  style,
}: SkeletonLoaderProps) {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();

    return () => shimmer.stop();
  }, [shimmerAnimation]);

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View
      style={[
        styles.container,
        { width, height, borderRadius } as ViewStyle,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            opacity,
            borderRadius,
          },
        ]}
      />
    </View>
  );
}

// Preset skeleton components for common use cases
export function SkeletonEventCard() {
  return (
    <View style={styles.eventCardSkeleton}>
      <SkeletonLoader width={80} height={120} style={styles.posterSkeleton} />
      <View style={styles.eventInfoSkeleton}>
        <SkeletonLoader width="80%" height={20} style={styles.mb8} />
        <SkeletonLoader width="60%" height={16} style={styles.mb8} />
        <SkeletonLoader width="50%" height={16} style={styles.mb8} />
        <SkeletonLoader width="70%" height={16} />
      </View>
    </View>
  );
}

export function SkeletonStatCard() {
  return (
    <View style={styles.statCardSkeleton}>
      <SkeletonLoader
        width={40}
        height={40}
        borderRadius={20}
        style={styles.mb12}
      />
      <SkeletonLoader width={60} height={32} style={styles.mb8} />
      <SkeletonLoader width={80} height={16} />
    </View>
  );
}

export function SkeletonProfileHeader() {
  return (
    <View style={styles.profileHeaderSkeleton}>
      <SkeletonLoader
        width={100}
        height={100}
        borderRadius={50}
        style={styles.mb16}
      />
      <SkeletonLoader width={150} height={24} style={styles.mb8} />
      <SkeletonLoader width={200} height={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.border,
    overflow: "hidden",
  },
  shimmer: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.borderLight,
  },
  eventCardSkeleton: {
    flexDirection: "row",
    backgroundColor: theme.components.surfaces.section,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.base,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  posterSkeleton: {
    marginRight: theme.spacing.md,
  },
  eventInfoSkeleton: {
    flex: 1,
    justifyContent: "center",
  },
  statCardSkeleton: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.components.surfaces.section,
    borderRadius: theme.borderRadius.lg,
    minWidth: 100,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  profileHeaderSkeleton: {
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  mb8: {
    marginBottom: 8,
  },
  mb12: {
    marginBottom: 12,
  },
  mb16: {
    marginBottom: 16,
  },
});
