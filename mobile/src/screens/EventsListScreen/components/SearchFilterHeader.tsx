import React, { memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/solid";
import * as Haptics from "expo-haptics";
import { theme } from "../../../theme";
import { styles } from "../EventsListScreen.styles";
import { FilterStatus } from "../hooks/useEventsData";

interface SearchFilterHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
}

/**
 * Memoized search bar and filter chips header component
 * Prevents unnecessary re-renders for better performance
 */
export const SearchFilterHeader = memo<SearchFilterHeaderProps>(
  ({ searchQuery, onSearchChange, filterStatus, onFilterChange }) => {
    return (
      <View>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MagnifyingGlassIcon size={20} color={theme.colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, movies, locations..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                onSearchChange("");
              }}
            >
              <XMarkIcon size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "all" && styles.filterChipActive,
            ]}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onFilterChange("all");
            }}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === "all" && styles.filterChipTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "upcoming" && styles.filterChipActive,
            ]}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onFilterChange("upcoming");
            }}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === "upcoming" && styles.filterChipTextActive,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "ongoing" && styles.filterChipActive,
            ]}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onFilterChange("ongoing");
            }}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === "ongoing" && styles.filterChipTextActive,
              ]}
            >
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "past" && styles.filterChipActive,
            ]}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onFilterChange("past");
            }}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === "past" && styles.filterChipTextActive,
              ]}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

SearchFilterHeader.displayName = "SearchFilterHeader";
