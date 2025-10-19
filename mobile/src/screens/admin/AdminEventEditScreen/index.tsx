/*===============================================
 * Admin Event Edit Screen
 * ==============================================
 * Edit existing events with full CRUD capabilities.
 * Features:
 * - Load existing event data
 * - Update movie via TMDB search
 * - Modify date, time, location, capacity
 * - Update pricing (free, fixed, PWYC)
 * - Form validation
 * - Save changes with loading states
 * ==============================================
 */

import React from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../../navigation/types";
import { theme } from "../../../theme";
import GradientBackground from "../../../components/GradientBackground";
import { useEventForm } from "./hooks/useEventForm";
import { useMovieSearch } from "./hooks/useMovieSearch";
import { styles } from "./AdminEventEditScreen.styles";
import {
  HintBanner,
  MoviePosterSection,
  TitleInput,
  EventInfoCard,
  DescriptionField,
  MovieInfoSection,
  ActionButtons,
  MovieSearchModal,
} from "./components";

type NavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminEventEdit"
>;
type RouteParams = RouteProp<AdminStackParamList, "AdminEventEdit">;

export default function AdminEventEditScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParams>();
  const { eventId } = route.params;

  // Event form hook (must be called before any conditional returns)
  const {
    loading,
    submitting,
    formState,
    setTitle,
    setDescription,
    setEventDate,
    setLocation,
    setMaxCapacity,
    setPrice,
    setPayWhatYouCan,
    setMinPrice,
    setTmdbId,
    setExistingMovieData,
    handleSubmit,
  } = useEventForm({ eventId });

  // Movie search hook
  const {
    showMovieSearch,
    searchQuery,
    searchResults,
    searching,
    setShowMovieSearch,
    setSearchQuery,
    searchMovies,
    handleMovieSelect,
    handleRemoveMovie,
  } = useMovieSearch({
    onMovieSelect: (movie) => {
      setExistingMovieData(null);
      setTitle(movie.title);
      setTmdbId(movie.id);
    },
    onRemoveMovie: () => {
      setExistingMovieData(null);
      setTmdbId(undefined);
    },
  });

  // Validate eventId AFTER hooks
  if (!eventId || !eventId.trim()) {
    return (
      <>
        <GradientBackground />
        <View style={styles.centered}>
          <Text style={{ color: theme.colors.text.primary }}>
            Invalid event ID
          </Text>
        </View>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <GradientBackground />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primaryLight} />
        </View>
      </>
    );
  }

  const currentPoster = formState.existingMovieData?.poster || null;
  const movieTitle = formState.existingMovieData?.title;

  return (
    <>
      <GradientBackground />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <HintBanner />

        <MoviePosterSection
          posterUrl={currentPoster}
          onAddMovie={() => setShowMovieSearch(true)}
          onChangeMovie={() => setShowMovieSearch(true)}
          onRemoveMovie={handleRemoveMovie}
        />

        <View style={styles.contentSection}>
          <TitleInput value={formState.title} onChangeText={setTitle} />

          <EventInfoCard
            eventDate={formState.eventDate}
            location={formState.location}
            maxCapacity={formState.maxCapacity}
            price={formState.price}
            minPrice={formState.minPrice}
            payWhatYouCan={formState.payWhatYouCan}
            onEventDateChange={setEventDate}
            onLocationChange={setLocation}
            onMaxCapacityChange={setMaxCapacity}
            onPriceChange={setPrice}
            onMinPriceChange={setMinPrice}
            onTogglePWYC={() => setPayWhatYouCan(!formState.payWhatYouCan)}
          />

          <DescriptionField
            value={formState.description}
            onChangeText={setDescription}
          />

          <MovieInfoSection
            movieTitle={movieTitle}
            onPress={() => setShowMovieSearch(true)}
          />

          <ActionButtons
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => navigation.goBack()}
          />
        </View>
      </ScrollView>

      <MovieSearchModal
        visible={showMovieSearch}
        searchQuery={searchQuery}
        searchResults={searchResults}
        searching={searching}
        onClose={() => setShowMovieSearch(false)}
        onSearchChange={(text) => {
          setSearchQuery(text);
          searchMovies(text);
        }}
        onMovieSelect={handleMovieSelect}
      />
    </>
  );
}
