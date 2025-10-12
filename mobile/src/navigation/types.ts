import type { Event } from "../types";

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

// Main Tab Navigator
export type MainTabParamList = {
  EventsTab: undefined;
  ProfileTab: undefined;
  AdminTab?: undefined; // Optional, only shown to admins
};

// Events Stack Navigator
export type EventsStackParamList = {
  EventsList: undefined;
  EventDetail: { eventId: string };
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
