// User & Auth Types
export type Role = "member" | "staff";

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

// Event Types
export type Event = {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO
  location?: string;
  onlineLink?: string;
  movieId?: string; // OMDb/TMDb ID
  movieData?: MovieData;
  maxCapacity?: number;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
};

// Movie Types (for OMDb/TMDb integration)
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
  imdbId?: string; // IMDB ID for linking
  trailer?: string; // YouTube link
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

// Payment Types
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export type Payment = {
  id: string;
  userId: string;
  eventId: string;
  amount: number; // in cents
  status: PaymentStatus;
  stripeId?: string;
  createdAt: string;
  updatedAt: string;
};
