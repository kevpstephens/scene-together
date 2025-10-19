import React from "react";
import { View, Text, Image } from "react-native";
import { UserIcon } from "react-native-heroicons/solid";
import { theme } from "../../../../theme";
import { Attendee } from "../hooks";
import { formatDate, getStatusColor } from "../utils";
import { styles } from "../AdminEventAttendeesScreen.styles";

interface AttendeeCardProps {
  attendee: Attendee;
}

export const AttendeeCard: React.FC<AttendeeCardProps> = ({ attendee }) => {
  return (
    <View style={styles.attendeeCard}>
      <View style={styles.attendeeIcon}>
        {attendee.user.avatarUrl ? (
          <Image
            source={{ uri: attendee.user.avatarUrl }}
            style={styles.attendeeAvatar}
            resizeMode="cover"
          />
        ) : (
          <UserIcon size={24} color={theme.colors.primary} />
        )}
      </View>
      <View style={styles.attendeeInfo}>
        <Text style={styles.attendeeName}>
          {attendee.user.name || attendee.user.email}
        </Text>
        {attendee.user.name && (
          <Text style={styles.attendeeEmail}>{attendee.user.email}</Text>
        )}
        <Text style={styles.attendeeDate}>
          RSVP: {formatDate(attendee.createdAt)}
        </Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: `${getStatusColor(attendee.status)}20` },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            { color: getStatusColor(attendee.status) },
          ]}
        >
          {attendee.status}
        </Text>
      </View>
    </View>
  );
};
