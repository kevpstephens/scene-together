// Local types for mobile app (copied from shared to avoid React conflicts)

export type Role = "member" | "staff";

export type Event = {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO
  location?: string;
  onlineLink?: string;
  movieId?: string;
  movieData?: MovieData;
  maxCapacity?: number;
  attendeeCount?: number; // Real RSVP count from API
  createdById?: string;
  // Payment fields
  price?: number | null; // Price in cents
  payWhatYouCan?: boolean; // Allow flexible pricing
  minPrice?: number | null; // Minimum price for pay-what-you-can (in cents)
  createdAt: string;
  updatedAt: string;
};

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

export type RSVPStatus = "going" | "interested" | "not_going";

export type RSVP = {
  id: string;
  userId: string;
  eventId: string;
  status: RSVPStatus;
  createdAt: string;
  updatedAt: string;
};
