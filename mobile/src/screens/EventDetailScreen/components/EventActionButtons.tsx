import React from "react";
import { View, Text } from "react-native";
import { CalendarIcon, ShareIcon } from "react-native-heroicons/outline";
import AnimatedButton from "../../../components/AnimatedButton";
import { theme } from "../../../theme";
import { styles } from "../EventDetailScreen.styles";

interface EventActionButtonsProps {
  onAddToCalendar: () => void;
  onShare: () => void;
}

export const EventActionButtons: React.FC<EventActionButtonsProps> = ({
  onAddToCalendar,
  onShare,
}) => {
  return (
    <View style={styles.actionButtonsRow}>
      <AnimatedButton style={styles.actionButton} onPress={onAddToCalendar}>
        <CalendarIcon size={18} color={theme.colors.primary} />
        <Text style={styles.actionButtonText}>Add to Calendar</Text>
      </AnimatedButton>

      <AnimatedButton style={styles.actionButton} onPress={onShare}>
        <ShareIcon size={18} color={theme.colors.accent} />
        <Text style={styles.actionButtonText}>Share Event</Text>
      </AnimatedButton>
    </View>
  );
};
