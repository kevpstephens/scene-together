import React from "react";
import { View } from "react-native";
import { theme } from "../../../../theme";
import SkeletonLoader from "../../../../components/SkeletonLoader";
import { styles } from "../AdminDashboardScreen.styles";

export const LoadingSkeleton: React.FC = () => {
  return (
    <>
      {/* Welcome Box Skeleton */}
      <View style={styles.welcomeBox}>
        <SkeletonLoader
          width="80%"
          height={24}
          style={{ marginBottom: theme.spacing.md }}
        />
        <SkeletonLoader
          width="100%"
          height={16}
          style={{ marginBottom: theme.spacing.sm }}
        />
        <SkeletonLoader
          width="95%"
          height={16}
          style={{ marginBottom: theme.spacing.sm }}
        />
        <SkeletonLoader width="70%" height={16} />
      </View>

      {/* Stats Skeleton */}
      <View style={styles.statsContainer}>
        <View style={styles.statsGrid}>
          {/* Left Circle Skeleton */}
          <View
            style={[
              styles.statCircle,
              styles.leftCircle,
              { backgroundColor: "#46D4AF" },
            ]}
          >
            <SkeletonLoader
              width={28}
              height={28}
              borderRadius={14}
              style={{ marginBottom: 8 }}
            />
            <SkeletonLoader width={40} height={24} />
            <SkeletonLoader width={50} height={12} style={{ marginTop: 4 }} />
          </View>

          {/* Center Circle Skeleton */}
          <View
            style={[
              styles.statCircle,
              styles.centerCircle,
              { backgroundColor: "#1E3A5F" },
            ]}
          >
            <SkeletonLoader
              width={28}
              height={28}
              borderRadius={14}
              style={{ marginBottom: 8 }}
            />
            <SkeletonLoader width={40} height={24} />
            <SkeletonLoader width={60} height={12} style={{ marginTop: 4 }} />
          </View>

          {/* Right Circle Skeleton */}
          <View
            style={[
              styles.statCircle,
              styles.rightCircle,
              { backgroundColor: "#2D5F7E" },
            ]}
          >
            <SkeletonLoader
              width={28}
              height={28}
              borderRadius={14}
              style={{ marginBottom: 8 }}
            />
            <SkeletonLoader width={40} height={24} />
            <SkeletonLoader width={50} height={12} style={{ marginTop: 4 }} />
          </View>
        </View>
      </View>

      {/* Quick Actions Skeleton */}
      <View style={styles.section}>
        <SkeletonLoader
          width={150}
          height={24}
          style={{ marginBottom: theme.spacing.base }}
        />

        <View style={styles.actionCard}>
          <View style={styles.actionIconContainer}>
            <SkeletonLoader width={24} height={24} borderRadius={12} />
          </View>
          <View style={styles.actionContent}>
            <SkeletonLoader
              width="60%"
              height={18}
              style={{ marginBottom: 6 }}
            />
            <SkeletonLoader width="90%" height={14} />
          </View>
        </View>

        <View style={styles.actionCard}>
          <View style={styles.actionIconContainer}>
            <SkeletonLoader width={24} height={24} borderRadius={12} />
          </View>
          <View style={styles.actionContent}>
            <SkeletonLoader
              width="50%"
              height={18}
              style={{ marginBottom: 6 }}
            />
            <SkeletonLoader width="80%" height={14} />
          </View>
        </View>
      </View>
    </>
  );
};
