import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../navigation/types";
import { XMarkIcon } from "react-native-heroicons/solid";
import { theme } from "../../theme";
import { api } from "../../services/api";
import GradientBackground from "../../components/GradientBackground";
import DateTimePickerComponent from "../../components/DateTimePicker";

type Movie = {
  id: number;
  title: string;
  year: string;
  poster: string | null;
  plot: string;
  rating: string;
};

type NavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminEventEdit"
>;
type RouteParams = RouteProp<AdminStackParamList, "AdminEventEdit">;

export default function AdminEventEditScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParams>();
  const { eventId } = route.params;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [tmdbId, setTmdbId] = useState<number | undefined>();

  // Movie search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const { data } = await api.get("/movies/search", {
        params: { query },
      });
      setSearchResults(data.results.slice(0, 5));
    } catch (error) {
      console.error("Failed to search movies:", error);
      Alert.alert("Error", "Failed to search movies");
    } finally {
      setSearching(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setSearchResults([]);
    setSearchQuery("");
    setTmdbId(movie.id);
  };

  const handleRemoveMovie = () => {
    setSelectedMovie(null);
    setTmdbId(undefined);
  };

  const loadEvent = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/events/${eventId}`);

      setTitle(data.title);
      setDescription(data.description || "");
      setEventDate(new Date(data.date));

      setLocation(data.location || "");
      setMaxCapacity(String(data.maxCapacity || ""));
      setPrice(String(data.price || "0"));

      // Load existing movie data if available
      if (data.movieData) {
        setTmdbId(data.movieData.tmdbId);
        setSelectedMovie({
          id: data.movieData.tmdbId,
          title: data.movieData.title,
          year: data.movieData.year || "",
          poster: data.movieData.poster || null,
          plot: description,
          rating: "",
        });
      }
    } catch (error) {
      console.error("Failed to load event:", error);
      Alert.alert("Error", "Failed to load event details", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert("Validation Error", "Please enter an event title");
      return;
    }
    if (!description.trim() || description.length < 10) {
      Alert.alert(
        "Validation Error",
        "Please enter a description (at least 10 characters)"
      );
      return;
    }
    if (!location.trim()) {
      Alert.alert("Validation Error", "Please enter a location");
      return;
    }
    const capacityNum = parseInt(maxCapacity);
    if (isNaN(capacityNum) || capacityNum < 1) {
      Alert.alert("Validation Error", "Capacity must be at least 1");
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      Alert.alert("Validation Error", "Price cannot be negative");
      return;
    }

    setSubmitting(true);
    try {
      const dateISO = eventDate.toISOString();

      // Fetch movie data from TMDB if a movie is selected
      let movieData = null;
      if (tmdbId) {
        try {
          const { data } = await api.get(`/movies/${tmdbId}`);
          movieData = data;
        } catch (error) {
          console.error("Failed to fetch movie details:", error);
        }
      }

      await api.put(`/events/${eventId}`, {
        title,
        description,
        date: dateISO,
        location,
        maxCapacity: capacityNum,
        movieData,
      });

      Alert.alert("Success", "Event updated successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error("Failed to update event:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update event";
      Alert.alert("Error", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <GradientBackground />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Edit Event Details</Text>

          {/* Movie Search */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Search Movie (Optional)</Text>
            <TextInput
              style={styles.input}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                searchMovies(text);
              }}
              placeholder="Search for a movie..."
              placeholderTextColor={theme.colors.text.tertiary}
            />
            {searching && (
              <ActivityIndicator
                size="small"
                color={theme.colors.primary}
                style={styles.searchLoader}
              />
            )}
          </View>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <View style={styles.searchResults}>
              {searchResults.map((movie) => (
                <TouchableOpacity
                  key={movie.id}
                  style={styles.movieResult}
                  onPress={() => handleMovieSelect(movie)}
                >
                  {movie.poster ? (
                    <Image
                      source={{
                        uri: movie.poster,
                      }}
                      style={styles.moviePoster}
                    />
                  ) : (
                    <View style={styles.moviePosterPlaceholder}>
                      <Text style={styles.moviePosterPlaceholderText}>
                        No Image
                      </Text>
                    </View>
                  )}
                  <View style={styles.movieInfo}>
                    <Text style={styles.movieTitle}>{movie.title}</Text>
                    <Text style={styles.movieYear}>
                      {movie.year || "Unknown"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Selected Movie */}
          {selectedMovie && (
            <View style={styles.selectedMovie}>
              <Text style={styles.selectedMovieLabel}>Selected Movie:</Text>
              <View style={styles.selectedMovieCard}>
                {selectedMovie.poster && (
                  <Image
                    source={{
                      uri: selectedMovie.poster,
                    }}
                    style={styles.selectedMoviePoster}
                  />
                )}
                <View style={styles.selectedMovieInfo}>
                  <Text style={styles.selectedMovieTitle}>
                    {selectedMovie.title}
                  </Text>
                  {selectedMovie.year && (
                    <Text style={styles.selectedMovieYear}>
                      {selectedMovie.year}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={handleRemoveMovie}
                  style={styles.removeButton}
                >
                  <XMarkIcon size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Event Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Grand Budapest Hotel Screening"
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Join us for an unforgettable screening..."
              placeholderTextColor={theme.colors.text.tertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <DateTimePickerComponent
            label="Date & Time *"
            value={eventDate}
            onChange={setEventDate}
          />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="The Grand Cinema, London"
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>Max Capacity *</Text>
              <TextInput
                style={styles.input}
                value={maxCapacity}
                onChangeText={setMaxCapacity}
                placeholder="50"
                placeholderTextColor={theme.colors.text.tertiary}
                keyboardType="number-pad"
              />
            </View>

            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>Price (£)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor={theme.colors.text.tertiary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.base,
    maxWidth: theme.layout.maxWidth,
    width: "100%",
    alignSelf: "center",
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.base,
  },
  formGroup: {
    marginBottom: theme.spacing.base,
  },
  formGroupHalf: {
    flex: 1,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  textArea: {
    minHeight: 100,
    paddingTop: theme.spacing.base,
  },
  hint: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: theme.spacing.base,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
  },
  submitButton: {
    flex: 1,
    paddingVertical: theme.spacing.base,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.md,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: "#fff",
  },
  searchLoader: {
    marginTop: theme.spacing.sm,
  },
  searchResults: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  movieResult: {
    flexDirection: "row",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: "center",
  },
  moviePoster: {
    width: 46,
    height: 69,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
  },
  moviePosterPlaceholder: {
    width: 46,
    height: 69,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.border,
    marginRight: theme.spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  moviePosterPlaceholderText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textAlign: "center",
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  movieYear: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  selectedMovie: {
    marginBottom: theme.spacing.base,
  },
  selectedMovieLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  selectedMovieCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  selectedMoviePoster: {
    width: 46,
    height: 69,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
  },
  selectedMovieInfo: {
    flex: 1,
  },
  selectedMovieTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  selectedMovieYear: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  removeButton: {
    padding: theme.spacing.sm,
  },
});
