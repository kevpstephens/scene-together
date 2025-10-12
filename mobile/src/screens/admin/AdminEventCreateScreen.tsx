import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../navigation/types";
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/solid";
import { theme } from "../../theme";
import { getCardStyle } from "../../theme/styles";
import { api } from "../../services/api";
import GradientBackground from "../../components/GradientBackground";
import DateTimePickerComponent from "../../components/DateTimePicker";

type NavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminEventCreate"
>;

interface Movie {
  id: number;
  title: string;
  year: string;
  poster: string | null;
  plot: string;
  rating: string;
}

export default function AdminEventCreateScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("50");
  const [price, setPrice] = useState("0");
  const [payWhatYouCan, setPayWhatYouCan] = useState(false);
  const [minPrice, setMinPrice] = useState("0");
  const [tmdbId, setTmdbId] = useState<number | undefined>();

  // Movie search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searching, setSearching] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);

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
    setTitle(movie.title);
    setDescription(movie.plot || "");
    setTmdbId(movie.id);
  };

  const handleRemoveMovie = () => {
    setSelectedMovie(null);
    setTmdbId(undefined);
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
    if (eventDate < new Date()) {
      Alert.alert("Validation Error", "Event date must be in the future");
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

    // Validate minPrice if pay-what-you-can is enabled
    if (payWhatYouCan) {
      const minPriceNum = parseFloat(minPrice);
      if (isNaN(minPriceNum) || minPriceNum < 0) {
        Alert.alert("Validation Error", "Minimum price cannot be negative");
        return;
      }
      if (minPriceNum > priceNum && priceNum > 0) {
        Alert.alert(
          "Validation Error",
          "Minimum price cannot be greater than suggested price"
        );
        return;
      }
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

      // Convert prices from pounds to cents
      const priceInCents = priceNum > 0 ? Math.round(priceNum * 100) : null;
      const minPriceInCents =
        payWhatYouCan && parseFloat(minPrice) > 0
          ? Math.round(parseFloat(minPrice) * 100)
          : null;

      // Build create payload, omitting null/undefined fields
      const createPayload: any = {
        title,
        description,
        date: dateISO,
        location,
        maxCapacity: capacityNum,
        price: priceInCents,
        payWhatYouCan,
        minPrice: minPriceInCents,
      };

      // Only include movieData if it exists
      if (movieData) {
        createPayload.movieData = movieData;
      }

      const response = await api.post("/events", createPayload);

      // Navigate back immediately for instant feedback
      navigation.goBack();

      // Show success toast after navigation
      setTimeout(() => {
        Alert.alert("Success", "Event created successfully!");
      }, 100);
    } catch (error: any) {
      console.error("Failed to create event:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create event";
      Alert.alert("Error", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.pageTitle}>Create Event</Text>

          <View style={styles.formCard}>
            {/* Movie Search Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Search Movie (Optional)</Text>
              <Text style={styles.sectionSubtitle}>
                Find a movie on TMDB to auto-fill details
              </Text>

              <View style={styles.searchContainer}>
                <MagnifyingGlassIcon
                  size={20}
                  color={theme.colors.text.tertiary}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    if (text.length > 2) {
                      searchMovies(text);
                    } else {
                      setSearchResults([]);
                    }
                  }}
                  placeholder="Search for a movie..."
                  placeholderTextColor={theme.colors.text.tertiary}
                />
                {searching && (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primaryLight}
                    style={styles.searchLoading}
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
                        <Text style={styles.movieOverview} numberOfLines={2}>
                          {movie.plot}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Selected Movie */}
              {selectedMovie && (
                <View style={styles.selectedMovie}>
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
                    <Text style={styles.selectedMovieSubtitle}>
                      Selected from TMDB
                    </Text>
                  </View>
                  <TouchableOpacity onPress={handleRemoveMovie}>
                    <XMarkIcon size={24} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Event Details Form */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Event Details</Text>

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
                minimumDate={new Date()}
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
                  <Text style={styles.label}>
                    {payWhatYouCan ? "Suggested Price (£)" : "Price (£)"}
                  </Text>
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

              {/* Pay What You Can Option */}
              <View style={styles.formGroup}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setPayWhatYouCan(!payWhatYouCan)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      payWhatYouCan && styles.checkboxChecked,
                    ]}
                  >
                    {payWhatYouCan && (
                      <Text style={styles.checkboxCheckmark}>✓</Text>
                    )}
                  </View>
                  <View style={styles.checkboxLabelContainer}>
                    <Text style={styles.checkboxLabel}>
                      Enable "Pay What You Can"
                    </Text>
                    <Text style={styles.checkboxSubtext}>
                      Allow attendees to choose their own price
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Minimum Price (shown only when pay-what-you-can is enabled) */}
              {payWhatYouCan && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Minimum Price (£)</Text>
                  <Text style={styles.helperText}>
                    Optional minimum amount attendees must pay
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={minPrice}
                    onChangeText={setMinPrice}
                    placeholder="0.00"
                    placeholderTextColor={theme.colors.text.tertiary}
                    keyboardType="decimal-pad"
                  />
                </View>
              )}
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
                  <Text style={styles.submitButtonText}>Create Event</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    maxWidth: theme.layout.maxWidth,
    width: "100%",
    alignSelf: "center",
  },
  pageTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
  },
  formCard: {
    ...getCardStyle(),
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.base,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.base,
    ...theme.shadows.sm,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  searchLoading: {
    marginLeft: theme.spacing.sm,
  },
  searchResults: {
    marginTop: theme.spacing.base,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  movieResult: {
    flexDirection: "row",
    padding: theme.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  moviePoster: {
    width: 50,
    height: 75,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.border,
    marginRight: theme.spacing.base,
  },
  moviePosterPlaceholder: {
    width: 50,
    height: 75,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.border,
    marginRight: theme.spacing.base,
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
    marginBottom: theme.spacing.xs,
  },
  movieOverview: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  selectedMovie: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    marginTop: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  selectedMoviePoster: {
    width: 50,
    height: 75,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.base,
  },
  selectedMovieInfo: {
    flex: 1,
  },
  selectedMovieTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  selectedMovieSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
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
    backgroundColor: theme.components.surfaces.section,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.components.borders.default,
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: theme.spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.base,
    backgroundColor: theme.components.surfaces.section,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxCheckmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: theme.typography.fontWeight.bold,
  },
  checkboxLabelContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  checkboxSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  helperText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
});
