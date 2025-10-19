import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../ProfileScreen.styles";
import type { EventFilter } from "../hooks";

interface EventFilterTabsProps {
  activeFilter: EventFilter;
  onFilterChange: (filter: EventFilter) => void;
}

/**
 * Filter tabs for switching between upcoming, interested, and past events
 */
export const EventFilterTabs: React.FC<EventFilterTabsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === "upcoming" && styles.filterButtonActive,
        ]}
        onPress={() => onFilterChange("upcoming")}
      >
        <Text
          style={[
            styles.filterButtonText,
            activeFilter === "upcoming" && styles.filterButtonTextActive,
          ]}
        >
          Upcoming
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === "interested" && styles.filterButtonActive,
        ]}
        onPress={() => onFilterChange("interested")}
      >
        <Text
          style={[
            styles.filterButtonText,
            activeFilter === "interested" && styles.filterButtonTextActive,
          ]}
        >
          Interested
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === "past" && styles.filterButtonActive,
        ]}
        onPress={() => onFilterChange("past")}
      >
        <Text
          style={[
            styles.filterButtonText,
            activeFilter === "past" && styles.filterButtonTextActive,
          ]}
        >
          Past
        </Text>
      </TouchableOpacity>
    </View>
  );
};
