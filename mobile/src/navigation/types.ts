/*===============================================
 * Navigation Types
 * ==============================================
 * TypeScript definitions for all navigation stacks.
 * Defines screen parameters and navigation structure.
 * ==============================================
 */

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
  Profile: { userId: string }; // For viewing event organizer profiles
};

// Main Tab Navigator
export type MainTabParamList = {
  EventsTab: NavigatorScreenParams<EventsStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
  AdminTab?: undefined; // Optional, only shown to admins
};

// Profile Stack Navigator
export type ProfileStackParamList = {
  Profile: { userId?: string }; // Optional userId for viewing other users' profiles
  ProfileEdit: undefined;
  EventDetail: { eventId: string };
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
