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
  Modal,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../navigation/types";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  TicketIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  FilmIcon,
  PlusIcon,
} from "react-native-heroicons/outline";
import { theme } from "../../theme";
import { api } from "../../services/api";
import GradientBackground from "../../components/GradientBackground";
import DateTimePickerComponent from "../../components/DateTimePicker";
import AnimatedButton from "../../components/AnimatedButton";

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
  const [showMovieSearch, setShowMovieSearch] = useState(false);
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
    } catch (error: any) {
      console.error("Failed to search movies:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.message ||
        "Failed to search movies";
      Alert.alert("Error", errorMsg);
    } finally {
      setSearching(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setSearchResults([]);
    setSearchQuery("");
    setTitle(movie.title);
    setTmdbId(movie.id);
    setShowMovieSearch(false);
  };

  const handleRemoveMovie = () => {
    setSelectedMovie(null);
    setTmdbId(undefined);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatPriceDisplay = () => {
    const priceNum = parseFloat(price) || 0;

    if (priceNum === 0) {
      return "FREE";
    }

    if (payWhatYouCan) {
      const minPriceNum = parseFloat(minPrice) || 0;
      if (minPriceNum > 0) {
        return `£${minPriceNum.toFixed(2)}+ (Pay What You Can)`;
      }
      return `£${priceNum.toFixed(2)}+ (Pay What You Can)`;
    }

    return `£${priceNum.toFixed(2)}`;
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert("Validation Error", "Please enter an event title");
      return;
    }

    if (!location.trim()) {
      Alert.alert("Validation Error", "Please enter a location");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Validation Error", "Please enter an event description");
      return;
    }

    setSubmitting(true);

    try {
      // Convert prices from pounds to cents for storage
      const priceInCents = Math.round(parseFloat(price) * 100);
      const minPriceInCents = minPrice
        ? Math.round(parseFloat(minPrice) * 100)
        : null;

      // Fetch movie details if a movie was selected
      let movieData = null;
      if (tmdbId) {
        try {
          const { data } = await api.get(`/movies/${tmdbId}`);
          movieData = data;
        } catch (error) {
          console.error("Failed to fetch movie details:", error);
          // Continue without movie data
        }
      }

      const createPayload: any = {
        title,
        description,
        date: eventDate.toISOString(),
        location,
        maxCapacity: parseInt(maxCapacity),
        price: priceInCents || null,
        payWhatYouCan: payWhatYouCan || false,
        minPrice: minPriceInCents || null,
      };

      // Only include movieData if we have it
      if (movieData) {
        createPayload.movieData = movieData;
      }

      await api.post("/events", createPayload);

      Alert.alert("Success", "Event created successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error("Failed to create event:", error);
      const errorMsg = error.response?.data?.error || "Failed to create event";
      Alert.alert("Error", errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <GradientBackground />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Inline Editing Hint */}
        <View style={styles.hintBanner}>
          <PencilIcon size={16} color={theme.colors.primary} />
          <Text style={styles.hintText}>
            Tap sections to edit • Creating your event listing
          </Text>
        </View>

        {/* Hero Image / Movie Poster */}
        {selectedMovie?.poster ? (
          <View style={styles.heroContainer}>
            <View style={styles.posterWrapper}>
              <Image
                source={{ uri: selectedMovie.poster }}
                style={styles.heroImage}
                resizeMode="contain"
              />
              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(10, 15, 20, 0.3)",
                  "rgba(10, 15, 20, 0.6)",
                ]}
                style={styles.posterGradient}
              />
              {/* Remove Movie Button */}
              <TouchableOpacity
                style={styles.removeMovieButton}
                onPress={handleRemoveMovie}
              >
                <XMarkIcon size={20} color={theme.colors.text.inverse} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addMoviePlaceholder}
            onPress={() => setShowMovieSearch(true)}
          >
            <PlusIcon size={48} color={theme.colors.primary} />
            <Text style={styles.addMovieText}>Add Movie Poster</Text>
            <Text style={styles.addMovieSubtext}>Search TMDB (Optional)</Text>
          </TouchableOpacity>
        )}

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Event Title - Editable */}
          <View style={styles.editableSection}>
            <TextInput
              style={styles.titleInput}
              placeholder="Event Title"
              placeholderTextColor={theme.colors.text.tertiary}
              value={title}
              onChangeText={setTitle}
              multiline
            />
          </View>

          {/* Event Details Card */}
          <View style={styles.infoCard}>
            {/* Date & Time */}
            <View style={styles.infoRowFull}>
              <View style={styles.dateTimeHeader}>
                <CalendarIcon size={20} color={theme.colors.primary} />
                <Text style={styles.infoLabel}>Date & Time</Text>
              </View>
              <DateTimePickerComponent
                value={eventDate}
                onChange={setEventDate}
              />
            </View>

            {/* Location - Editable */}
            <View style={styles.infoRow}>
              <MapPinIcon size={20} color={theme.colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Location</Text>
                <TextInput
                  style={styles.infoValueInput}
                  placeholder="Enter location"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>

            {/* Capacity - Editable */}
            <View style={styles.infoRow}>
              <UsersIcon size={20} color={theme.colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Capacity</Text>
                <TextInput
                  style={styles.infoValueInput}
                  placeholder="50"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={maxCapacity}
                  onChangeText={setMaxCapacity}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Price - Editable */}
            <View style={styles.infoRow}>
              <TicketIcon size={20} color={theme.colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Price</Text>
                <View style={styles.priceInputContainer}>
                  <TextInput
                    style={[styles.infoValueInput, styles.priceInput]}
                    placeholder="0.00"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                  />
                  {parseFloat(price) > 0 && (
                    <TouchableOpacity
                      style={styles.pywcToggle}
                      onPress={() => setPayWhatYouCan(!payWhatYouCan)}
                    >
                      <Text style={styles.pywcToggleText}>
                        {payWhatYouCan ? "✓ PWYC" : "PWYC?"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {payWhatYouCan && (
                  <View style={styles.minPriceRow}>
                    <Text style={styles.minPriceLabel}>Min Price: £</Text>
                    <TextInput
                      style={styles.minPriceInput}
                      placeholder="0.00"
                      placeholderTextColor={theme.colors.text.tertiary}
                      value={minPrice}
                      onChangeText={setMinPrice}
                      keyboardType="decimal-pad"
                    />
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Description - Editable */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About This Event</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Describe your event..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Movie Info (if selected) */}
          {selectedMovie && (
            <TouchableOpacity
              style={styles.movieSection}
              onPress={() => setShowMovieSearch(true)}
            >
              <View style={styles.sectionHeader}>
                <FilmIcon size={20} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>
                  Film: {selectedMovie.title}
                </Text>
                <PencilIcon size={16} color={theme.colors.text.tertiary} />
              </View>
              <Text style={styles.movieSubtext}>Tap to change movie</Text>
            </TouchableOpacity>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <AnimatedButton
              style={styles.createButton}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={theme.colors.text.inverse} />
              ) : (
                <Text style={styles.createButtonText}>Create Event</Text>
              )}
            </AnimatedButton>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={submitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Movie Search Modal */}
      <Modal
        visible={showMovieSearch}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMovieSearch(false)}
      >
        <View style={styles.modalContainer}>
          <GradientBackground />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Search Movie</Text>
            <TouchableOpacity onPress={() => setShowMovieSearch(false)}>
              <XMarkIcon size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <MagnifyingGlassIcon
                size={20}
                color={theme.colors.text.tertiary}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search TMDB..."
                placeholderTextColor={theme.colors.text.tertiary}
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  searchMovies(text);
                }}
                autoFocus
              />
              {searching && (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              )}
            </View>
          </View>

          <ScrollView style={styles.searchResults}>
            {searchResults.map((movie) => (
              <TouchableOpacity
                key={movie.id}
                style={styles.movieResult}
                onPress={() => handleMovieSelect(movie)}
              >
                {movie.poster && (
                  <Image
                    source={{ uri: movie.poster }}
                    style={styles.moviePoster}
                  />
                )}
                <View style={styles.movieInfo}>
                  <Text style={styles.movieTitle}>{movie.title}</Text>
                  <Text style={styles.movieYear}>{movie.year}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  hintBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: `${theme.colors.primary}20`,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: `${theme.colors.primary}40`,
  },
  hintText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  heroContainer: {
    width: "100%",
    height: 400,
    position: "relative",
  },
  posterWrapper: {
    width: "100%",
    height: "100%",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  posterGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  cropButton: {
    position: "absolute",
    bottom: theme.spacing.lg,
    left: "50%",
    transform: [{ translateX: -60 }],
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
      },
    }),
  },
  cropButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  removeMovieButton: {
    position: "absolute",
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.sm,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
      },
    }),
  },
  addMoviePlaceholder: {
    width: "100%",
    height: 300,
    backgroundColor: theme.colors.backgroundDark,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  addMovieText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: "700",
    color: theme.colors.text.primary,
    marginTop: theme.spacing.base,
  },
  addMovieSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  contentSection: {
    padding: theme.spacing.lg,
  },
  editableSection: {
    marginBottom: theme.spacing.lg,
  },
  titleInput: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: "800",
    color: theme.colors.text.primary,
    padding: 0,
    minHeight: 40,
  },
  infoCard: {
    backgroundColor: theme.components.surfaces.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.components.borders.default,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.components.borders.subtle,
  },
  infoRowFull: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.components.borders.subtle,
  },
  dateTimeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  infoValueInput: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: "600",
    color: theme.colors.text.primary,
    padding: 0,
    minHeight: 24,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  priceInput: {
    flex: 1,
  },
  pywcToggle: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  pywcToggleText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: "700",
    color: theme.colors.text.inverse,
  },
  minPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.xs,
  },
  minPriceLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  minPriceInput: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "600",
    color: theme.colors.text.primary,
    flex: 1,
    padding: 0,
  },
  descriptionSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "700",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  descriptionInput: {
    backgroundColor: theme.components.surfaces.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    minHeight: 120,
    borderWidth: 1,
    borderColor: theme.components.borders.default,
  },
  movieSection: {
    backgroundColor: theme.components.surfaces.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.components.borders.default,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  movieSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
    marginLeft: 28,
  },
  actionButtons: {
    gap: theme.spacing.base,
    marginTop: theme.spacing.xl,
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.base,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
  },
  createButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.base,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cancelButton: {
    paddingVertical: theme.spacing.base,
    alignItems: "center",
  },
  cancelButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: "600",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.components.borders.default,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  searchContainer: {
    padding: theme.spacing.lg,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.components.surfaces.card,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    padding: 0,
  },
  searchResults: {
    flex: 1,
  },
  movieResult: {
    flexDirection: "row",
    padding: theme.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: theme.components.borders.subtle,
    gap: theme.spacing.base,
  },
  moviePoster: {
    width: 60,
    height: 90,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.backgroundDark,
  },
  movieInfo: {
    flex: 1,
    justifyContent: "center",
  },
  movieTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  movieYear: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
  },
});
