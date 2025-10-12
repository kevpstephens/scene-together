import type { Event } from "../types";
import type { NavigatorScreenParams } from "@react-navigation/native";

// Root Stack Navigator - handles auth flow
export type RootStackParamList = {
  MainTabs: undefined;
  Auth: undefined;
};

// Auth Stack Navigator
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

// Events Stack Navigator
export type EventsStackParamList = {
  EventsList: undefined;
  EventDetail: { eventId: string };
};

// Main Tab Navigator
export type MainTabParamList = {
  EventsTab: NavigatorScreenParams<EventsStackParamList>;
  ProfileTab: undefined;
  AdminTab?: undefined; // Optional, only shown to admins
};

// Profile Stack Navigator
export type ProfileStackParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
  Settings: undefined;
};

// Admin Stack Navigator
export type AdminStackParamList = {
  AdminDashboard: undefined;
  AdminEvents: undefined;
  AdminEventCreate: undefined;
  AdminEventEdit: { eventId: string };
  AdminEventAttendees: { eventId: string };
};
