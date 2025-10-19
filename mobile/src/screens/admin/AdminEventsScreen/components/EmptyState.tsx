import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FilmIcon, PlusIcon } from "react-native-heroicons/solid";
import { theme } from "../../../../theme";
import { styles } from "../AdminEventsScreen.styles";

interface EmptyStateProps {
  onCreateEvent: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateEvent }) => {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIconWrapper}>
        <FilmIcon size={72} color={theme.colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>No Events Yet</Text>
      <Text style={styles.emptyText}>
        Create your first screening event and start building your community!
      </Text>
      <TouchableOpacity
        style={styles.emptyActionButton}
        onPress={onCreateEvent}
      >
        <PlusIcon size={20} color="#fff" />
        <Text style={styles.emptyActionText}>Create First Event</Text>
      </TouchableOpacity>
    </View>
  );
};
