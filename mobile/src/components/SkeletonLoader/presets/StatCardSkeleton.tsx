import React from "react";
import { View } from "react-native";
import { styles } from "../SkeletonLoader.styles";
import SkeletonLoader from "../SkeletonLoader";

/**
 * Preset skeleton for stat cards
 */
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
