import React from "react";
import { View, Text } from "react-native";
import { styles } from "../EventDetailScreen.styles";

interface EventDescriptionProps {
  description?: string;
}

export const EventDescription: React.FC<EventDescriptionProps> = ({
  description,
}) => {
  if (!description) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>About this event</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};
