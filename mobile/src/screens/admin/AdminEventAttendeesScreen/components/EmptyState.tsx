import React from "react";
import { View, Text } from "react-native";
import { UserIcon } from "react-native-heroicons/solid";
import { theme } from "../../../../theme";
import { styles } from "../AdminEventAttendeesScreen.styles";

export const EmptyState: React.FC = () => {
  return (
    <View style={styles.empty}>
      <UserIcon size={64} color={theme.colors.text.tertiary} />
      <Text style={styles.emptyTitle}>No RSVPs yet</Text>
      <Text style={styles.emptyText}>
        Attendees will appear here when they RSVP to this event
      </Text>
    </View>
  );
};
