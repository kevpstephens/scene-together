import React from "react";
import { View, Text, Animated } from "react-native";
import { FilmIcon, StarIcon, UsersIcon } from "react-native-heroicons/solid";
import { theme } from "../../../theme";
import { styles } from "../EventsListScreen.styles";

interface EmptyStateProps {
  fadeAnim: Animated.Value;
}

/**
 * Empty state component displayed when no events are found
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ fadeAnim }) => {
  return (
    <Animated.View style={[styles.emptyContent, { opacity: fadeAnim }]}>
      <View style={styles.emptyIconContainer}>
        <FilmIcon size={80} color={theme.colors.primary} />
        <View style={styles.emptyIconAccent} />
      </View>
      <Text style={styles.emptyTitle}>🍿 Grab Your Popcorn!</Text>
      <Text style={styles.emptySubtext}>No screenings scheduled yet</Text>
      <Text style={styles.emptyHint}>
        New movie events are added weekly.{"\n"}
        Pull down to refresh!
      </Text>
      <View style={styles.emptyFeatures}>
        <View style={styles.featureItem}>
          <StarIcon size={16} color={theme.colors.accent} />
          <Text style={styles.featureText}>Exclusive screenings</Text>
        </View>
        <View style={styles.featureItem}>
          <UsersIcon size={16} color={theme.colors.accent} />
          <Text style={styles.featureText}>Meet film lovers</Text>
        </View>
        <View style={styles.featureItem}>
          <FilmIcon size={16} color={theme.colors.accent} />
          <Text style={styles.featureText}>Classic & new films</Text>
        </View>
      </View>
    </Animated.View>
  );
};
