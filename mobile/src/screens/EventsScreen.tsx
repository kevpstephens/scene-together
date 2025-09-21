import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { api } from "../services/api";

type Event = { id: string; title: string; date: string };

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    api.get("/events").then((r) => setEvents(r.data));
  }, []);
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => (
          <Text>
            - {item.title} ({new Date(item.date).toDateString()})
          </Text>
        )}
      />
    </View>
  );
}
