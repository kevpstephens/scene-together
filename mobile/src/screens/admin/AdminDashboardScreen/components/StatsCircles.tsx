import React from "react";
import { View, Text } from "react-native";
import {
  FilmIcon,
  UsersIcon,
  ChartBarIcon,
} from "react-native-heroicons/solid";
import { styles } from "../AdminDashboardScreen.styles";

interface StatsCirclesProps {
  totalEvents: number;
  upcomingEvents: number;
  totalAttendees: number;
}

export const StatsCircles: React.FC<StatsCirclesProps> = ({
  totalEvents,
  upcomingEvents,
  totalAttendees,
}) => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statsGrid}>
        {/* Left Circle - Teal/Cyan */}
        <View
          style={[
            styles.statCircle,
            styles.leftCircle,
            { backgroundColor: "#46D4AF" },
          ]}
        >
          <FilmIcon size={28} color="#fff" />
          <Text style={styles.statValue}>{totalEvents}</Text>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>

        {/* Center Circle - Dark Blue */}
        <View
          style={[
            styles.statCircle,
            styles.centerCircle,
            { backgroundColor: "#1E3A5F" },
          ]}
        >
          <ChartBarIcon size={28} color="#fff" />
          <Text style={styles.statValue}>{upcomingEvents}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>

        {/* Right Circle - Accent Blue */}
        <View
          style={[
            styles.statCircle,
            styles.rightCircle,
            { backgroundColor: "#2D5F7E" },
          ]}
        >
          <UsersIcon size={28} color="#fff" />
          <Text style={styles.statValue}>{totalAttendees}</Text>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statLabel}>RSVPs</Text>
        </View>
      </View>
    </View>
  );
};
