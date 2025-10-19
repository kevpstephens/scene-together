import React, { useRef, useMemo, useLayoutEffect, useCallback } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Image,
  RefreshControl,
  Platform,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EventsStackParamList } from "../../navigation/types";
import type { Event } from "../../types";
import EventCardSkeleton from "../../components/EventCardSkeleton";
import GradientBackground from "../../components/GradientBackground";
import { useToast } from "../../contexts/toast";
import * as Haptics from "expo-haptics";
import { styles } from "./EventsListScreen.styles";
import { useEventsData, FilterStatus } from "./hooks/useEventsData";
import { useEventActions } from "./hooks/useEventActions";
import { useHeaderAnimation } from "./hooks/useHeaderAnimation";
import { SearchFilterHeader } from "./components/SearchFilterHeader";
import { EventCard } from "./components/EventCard";
import { EmptyState } from "./components/EmptyState";
import { theme } from "../../theme";

type NavigationProp = NativeStackNavigationProp<
  EventsStackParamList,
  "EventsList"
>;

export default function EventsListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const flatListRef = useRef<FlatList>(null);
  const { showToast } = useToast();

  // Custom Hooks
  const {
    loading,
    refreshing,
    searchQuery,
    filterStatus,
    userRSVPs,
    failedPosters,
    fadeAnim,
    filteredEvents,
    setSearchQuery,
    setFilterStatus,
    setUserRSVPs,
    setFailedPosters,
    onRefresh,
    loadUserRSVPs,
  } = useEventsData();

  const { handleShare, handleBookmark } = useEventActions({
    userRSVPs,
    setUserRSVPs,
    loadUserRSVPs,
    showToast,
  });

  const { isHeaderVisible, setIsHeaderVisible, handleScroll } =
    useHeaderAnimation({
      flatListRef,
    });

  // Configure header to match other screens - dynamically show/hide
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: isHeaderVisible,
      headerTitle: () => (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            ...(Platform.OS === "web" && {
              width: "100%",
              position: "absolute",
              left: 0,
              right: 0,
            }),
          }}
        >
          <Image
            source={require("../../../assets/logo/logo-transparent.png")}
            style={{ width: 200, height: 50 }}
            resizeMode="contain"
          />
        </View>
      ),
      ...(Platform.OS === "web" && {
        headerTitleAlign: "center",
      }),
    });
  }, [navigation, isHeaderVisible]);

  // Enhanced onRefresh with haptics and header visibility
  const handleRefresh = async () => {
    // Light haptic on pull start (native only)
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Show header when pull-to-refresh
    setIsHeaderVisible(true);

    await onRefresh();

    // Success haptic on refresh complete (native only)
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  // Memoize callbacks to prevent unnecessary re-renders of SearchFilterHeader
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery]
  );

  const handleFilterChange = useCallback(
    (status: FilterStatus) => {
      setFilterStatus(status);
    },
    [setFilterStatus]
  );

  // Memoized list header component - MUST be before any conditional returns
  const listHeaderComponent = useMemo(
    () => (
      <SearchFilterHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filterStatus={filterStatus}
        onFilterChange={handleFilterChange}
      />
    ),
    [searchQuery, filterStatus, handleSearchChange, handleFilterChange]
  );

  const renderEventCard = ({ item }: { item: Event; index: number }) => (
    <EventCard
      event={item}
      userRSVPs={userRSVPs}
      failedPosters={failedPosters}
      onNavigate={(eventId) => navigation.navigate("EventDetail", { eventId })}
      onShare={handleShare}
      onBookmark={handleBookmark}
      onPosterError={(eventId) =>
        setFailedPosters((prev) => ({ ...prev, [eventId]: true }))
      }
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.list}>
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientBackground />
      <View style={styles.contentWrapper}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
            ref={flatListRef}
            data={filteredEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderEventCard}
            ListHeaderComponent={listHeaderComponent}
            contentContainerStyle={
              filteredEvents.length === 0 ? styles.emptyContainer : styles.list
            }
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[theme.colors.primaryLight]}
                tintColor={theme.colors.primaryLight}
              />
            }
            ListEmptyComponent={<EmptyState fadeAnim={fadeAnim} />}
          />
        </Animated.View>
      </View>
    </View>
  );
}
