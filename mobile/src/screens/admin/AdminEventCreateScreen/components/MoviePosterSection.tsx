import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  PencilIcon,
  XMarkIcon,
  PlusIcon,
} from "react-native-heroicons/outline";
import { theme } from "../../../../theme";
import { styles } from "../AdminEventCreateScreen.styles";

interface MoviePosterSectionProps {
  posterUrl: string | null;
  onAddMovie: () => void;
  onChangeMovie: () => void;
  onRemoveMovie: () => void;
}

export const MoviePosterSection: React.FC<MoviePosterSectionProps> = ({
  posterUrl,
  onAddMovie,
  onChangeMovie,
  onRemoveMovie,
}) => {
  if (!posterUrl) {
    return (
      <TouchableOpacity style={styles.addMoviePlaceholder} onPress={onAddMovie}>
        <PlusIcon size={48} color={theme.colors.primary} />
        <Text style={styles.addMovieText}>Add Movie Poster</Text>
        <Text style={styles.addMovieSubtext}>Search TMDB (Optional)</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.heroContainer}>
      <View style={styles.posterWrapper}>
        <Image
          source={{ uri: posterUrl }}
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
          onPress={onRemoveMovie}
        >
          <XMarkIcon size={20} color={theme.colors.text.inverse} />
        </TouchableOpacity>
        {/* Change Movie Button */}
        <TouchableOpacity
          style={styles.changeMovieButton}
          onPress={onChangeMovie}
        >
          <PencilIcon size={20} color={theme.colors.text.inverse} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
