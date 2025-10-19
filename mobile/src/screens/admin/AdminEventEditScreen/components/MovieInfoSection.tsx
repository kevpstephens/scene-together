import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FilmIcon, PencilIcon } from "react-native-heroicons/outline";
import { theme } from "../../../../theme";
import { styles } from "../AdminEventEditScreen.styles";

interface MovieInfoSectionProps {
  movieTitle: string | undefined;
  onPress: () => void;
}

export const MovieInfoSection: React.FC<MovieInfoSectionProps> = ({
  movieTitle,
  onPress,
}) => {
  if (!movieTitle) return null;

  return (
    <TouchableOpacity style={styles.movieSection} onPress={onPress}>
      <View style={styles.sectionHeader}>
        <FilmIcon size={20} color={theme.colors.primary} />
        <Text
          style={[styles.sectionTitle, { flex: 1, marginBottom: 0 }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Film: {movieTitle}
        </Text>
        <PencilIcon size={16} color={theme.colors.text.tertiary} />
      </View>
      <Text style={styles.movieSubtext}>Tap to change movie</Text>
    </TouchableOpacity>
  );
};
