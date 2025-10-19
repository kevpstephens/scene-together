import React from "react";
import { View } from "react-native";
import { styles } from "../SkeletonLoader.styles";
import SkeletonLoader from "../SkeletonLoader";

/**
 * Preset skeleton for event cards
 */
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
