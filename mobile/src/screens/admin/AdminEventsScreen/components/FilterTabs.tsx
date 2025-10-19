import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../../../../theme";

export type EventFilter = "upcoming" | "past";

interface FilterTabsProps {
  activeFilter: EventFilter;
  onFilterChange: (filter: EventFilter) => void;
  upcomingCount: number;
  pastCount: number;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  activeFilter,
  onFilterChange,
  upcomingCount,
  pastCount,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeFilter === "upcoming" && styles.tabActive]}
        onPress={() => onFilterChange("upcoming")}
      >
        <Text
          style={[
            styles.tabText,
            activeFilter === "upcoming" && styles.tabTextActive,
          ]}
        >
          Upcoming
        </Text>
        <View
          style={[
            styles.badge,
            activeFilter === "upcoming" && styles.badgeActive,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              activeFilter === "upcoming" && styles.badgeTextActive,
            ]}
          >
            {upcomingCount}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeFilter === "past" && styles.tabActive]}
        onPress={() => onFilterChange("past")}
      >
        <Text
          style={[
            styles.tabText,
            activeFilter === "past" && styles.tabTextActive,
          ]}
        >
          Past
        </Text>
        <View
          style={[styles.badge, activeFilter === "past" && styles.badgeActive]}
        >
          <Text
            style={[
              styles.badgeText,
              activeFilter === "past" && styles.badgeTextActive,
            ]}
          >
            {pastCount}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.base,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.components.surfaces.card,
    borderWidth: 2,
    borderColor: theme.components.borders.default,
    gap: theme.spacing.xs,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },
  tabTextActive: {
    color: theme.colors.text.inverse,
  },
  badge: {
    backgroundColor: theme.colors.border,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    minWidth: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.tertiary,
  },
  badgeTextActive: {
    color: theme.colors.text.inverse,
  },
});
