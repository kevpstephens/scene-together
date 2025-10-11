// User & Auth Types
export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

export type User = {
  id: string;
  email: string;
  role: Role;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

// Movie Types (for TMDb integration)
export type MovieData = {
  title: string;
  year?: string;
  poster?: string;
  plot?: string;
  director?: string;
  actors?: string;
  runtime?: string;
  genre?: string;
  imdbRating?: string;
  imdbId?: string;
  trailer?: string;
};

// Event Types
export type Event = {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  onlineLink?: string;
  movieId?: string;
  movieData?: MovieData;
  maxCapacity?: number;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
};

// RSVP Types
export type RSVPStatus = "going" | "interested" | "not_going";

export type RSVP = {
  id: string;
  userId: string;
  eventId: string;
  status: RSVPStatus;
  createdAt: string;
  updatedAt: string;
};
