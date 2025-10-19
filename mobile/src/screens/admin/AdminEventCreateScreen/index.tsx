import React from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../../navigation/types";
import GradientBackground from "../../../components/GradientBackground";
import { useEventCreateForm, useMovieSearch } from "./hooks";
import { styles } from "./AdminEventCreateScreen.styles";
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
  "AdminEventCreate"
>;

export default function AdminEventCreateScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Event create form hook
  const {
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
    handleSubmit,
  } = useEventCreateForm();

  // Movie search hook
  const {
    showMovieSearch,
    searchQuery,
    searchResults,
    selectedMovie,
    searching,
    setShowMovieSearch,
    setSearchQuery,
    searchMovies,
    handleMovieSelect,
    handleRemoveMovie,
  } = useMovieSearch({
    onMovieSelect: (movie) => {
      setTitle(movie.title);
      setTmdbId(movie.id);
    },
    onRemoveMovie: () => {
      setTmdbId(undefined);
    },
  });

  return (
    <>
      <GradientBackground />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <HintBanner hintText="Tap sections to edit • Creating your event listing" />

        <MoviePosterSection
          posterUrl={selectedMovie?.poster || null}
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
            movieTitle={selectedMovie?.title}
            onPress={() => setShowMovieSearch(true)}
          />

          <ActionButtons
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => navigation.goBack()}
            submitButtonText="Create Event"
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
