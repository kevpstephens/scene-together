import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/outline";
import { theme } from "../../../../theme";
import GradientBackground from "../../../../components/GradientBackground";
import { styles } from "../AdminEventCreateScreen.styles";
import { Movie } from "../hooks";

interface MovieSearchModalProps {
  visible: boolean;
  searchQuery: string;
  searchResults: Movie[];
  searching: boolean;
  onClose: () => void;
  onSearchChange: (text: string) => void;
  onMovieSelect: (movie: Movie) => void;
}

export const MovieSearchModal: React.FC<MovieSearchModalProps> = ({
  visible,
  searchQuery,
  searchResults,
  searching,
  onClose,
  onSearchChange,
  onMovieSelect,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <GradientBackground />
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Search Movie</Text>
          <TouchableOpacity onPress={onClose}>
            <XMarkIcon size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MagnifyingGlassIcon size={20} color={theme.colors.text.tertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search TMDB..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={searchQuery}
              onChangeText={onSearchChange}
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
              onPress={() => onMovieSelect(movie)}
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
  );
};
