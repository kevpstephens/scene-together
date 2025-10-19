import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  TrophyIcon,
  FireIcon,
  FilmIcon,
  SparklesIcon,
} from "react-native-heroicons/solid";
import { theme } from "../../../theme";
import { styles } from "../ProfileScreen.styles";
import SkeletonLoader from "../../../components/SkeletonLoader";
import type { UserStats, RSVP } from "../hooks";
import { formatDate, getGenreColor } from "../utils";

interface StatsCardProps {
  loading: boolean;
  rsvps: RSVP[];
  userStats: UserStats;
}

/**
 * Stats card component displaying user activity stats
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  loading,
  rsvps,
  userStats,
}) => {
  if (loading) {
    return (
      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Your Activity</Text>
        <View style={styles.statsGrid}>
          <SkeletonLoader
            width={100}
            height={100}
            borderRadius={50}
            style={StyleSheet.flatten([styles.statCircle, styles.leftCircle])}
          />
          <SkeletonLoader
            width={100}
            height={100}
            borderRadius={50}
            style={StyleSheet.flatten([styles.statCircle, styles.centerCircle])}
          />
          <SkeletonLoader
            width={100}
            height={100}
            borderRadius={50}
            style={StyleSheet.flatten([styles.statCircle, styles.rightCircle])}
          />
        </View>
        <View style={styles.recentActivity}>
          <SkeletonLoader width="55%" height={16} style={{ marginBottom: 6 }} />
          <SkeletonLoader width="35%" height={14} />
        </View>
        <View style={styles.favoriteGenres}>
          <SkeletonLoader
            width="30%"
            height={14}
            style={{ marginBottom: theme.spacing.sm }}
          />
          <View style={styles.genreChipsContainer}>
            {[0, 1, 2].map((i) => (
              <SkeletonLoader
                key={i}
                width={90}
                height={32}
                borderRadius={theme.borderRadius.full}
                style={{
                  marginHorizontal: theme.spacing.xxs,
                  marginBottom: theme.spacing.xs,
                }}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }

  if (rsvps.length === 0) {
    return null;
  }

  return (
    <View style={styles.statsCard}>
      <Text style={styles.sectionTitle}>Your Activity</Text>

      {/* Stats Grid - Overlapping Circles */}
      <View style={styles.statsGrid}>
        {/* Left Circle - Attended (Teal/Cyan) */}
        <View
          style={[
            styles.statCircle,
            styles.leftCircle,
            { backgroundColor: "#46D4AF" },
          ]}
        >
          <TrophyIcon size={22} color="#fff" />
          <Text style={styles.statValue}>{userStats.totalAttended}</Text>
          <Text style={styles.statLabel}>Attended</Text>
        </View>

        {/* Center Circle - Upcoming (Dark Blue) */}
        <View
          style={[
            styles.statCircle,
            styles.centerCircle,
            { backgroundColor: "#1E3A5F" },
          ]}
        >
          <FireIcon size={22} color="#fff" />
          <Text style={styles.statValue}>{userStats.upcomingCount}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>

        {/* Right Circle - Total RSVPs (Accent Blue) */}
        <View
          style={[
            styles.statCircle,
            styles.rightCircle,
            { backgroundColor: "#2D5F7E" },
          ]}
        >
          <FilmIcon size={22} color="#fff" />
          <Text style={styles.statValue}>{rsvps.length}</Text>
          <Text style={styles.statLabel}>Total RSVPs</Text>
        </View>
      </View>

      {/* Recent Activity */}
      {userStats.recentEvent && (
        <View style={styles.recentActivity}>
          <View style={styles.recentActivityHeader}>
            <SparklesIcon size={16} color={theme.colors.primary} />
            <Text style={styles.recentActivityTitle}>Recent Activity</Text>
          </View>
          <Text style={styles.recentActivityText}>
            Last attended:{" "}
            <Text style={styles.recentActivityEvent}>
              {userStats.recentEvent.title}
            </Text>
          </Text>
          <Text style={styles.recentActivityDate}>
            {formatDate(userStats.recentEvent.date)}
          </Text>
        </View>
      )}

      {/* Favorite Genres */}
      {userStats.favoriteGenres.length > 0 && (
        <View style={styles.favoriteGenres}>
          <Text style={styles.favoriteGenresTitle}>Favorite Genres</Text>
          <View style={styles.genreChipsContainer}>
            {userStats.favoriteGenres.map((genre, index) => (
              <View
                key={index}
                style={[
                  styles.genreChip,
                  { backgroundColor: getGenreColor(genre) },
                ]}
              >
                <Text style={styles.genreChipText}>{genre}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
