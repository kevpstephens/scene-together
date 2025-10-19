import React from "react";
import { View, Text } from "react-native";
import { Event } from "../hooks";
import { formatDate } from "../utils";
import { styles } from "../AdminEventAttendeesScreen.styles";
import { CapacityCard } from "./CapacityCard";

interface EventHeaderProps {
  event: Event;
  currentAttendees: number;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  currentAttendees,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.eventTitle} numberOfLines={2}>
        {event.title}
      </Text>
      <Text style={styles.eventDate}>{formatDate(event.date)}</Text>

      <CapacityCard
        currentAttendees={currentAttendees}
        capacity={event.maxCapacity}
      />
    </View>
  );
};
