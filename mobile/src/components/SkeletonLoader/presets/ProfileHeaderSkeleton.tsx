import React from "react";
import { View } from "react-native";
import { styles } from "../SkeletonLoader.styles";
import SkeletonLoader from "../SkeletonLoader";

/**
 * Preset skeleton for profile headers
 */
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
