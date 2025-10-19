/*===============================================
 * Type Definitions
 * ==============================================
 * Central type definitions for the API.
 * Aligned with Prisma schema and client requirements.
 * ==============================================
 */

// ==================== User & Auth Types ====================

/**
 * User role enum matching Prisma schema
 * - USER: Regular members who can RSVP to events
 * - ADMIN: Event organizers who can create/manage events
 * - SUPER_ADMIN: Full system access
 */
export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

/**
 * Full user profile
 * Retrieved from database queries
 */
export type User = {
  id: string;
  email: string;
  role: Role;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * Authenticated user context
 * Attached to Express request after auth middleware
 */
export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

// ==================== Movie Types ====================

/**
 * Movie metadata from TMDb API
 * Stored as JSON in event.movieData
 */
export type MovieData = {
  title: string;
  year?: string;
  poster?: string; // Full TMDb image URL
  plot?: string;
  director?: string;
  actors?: string; // Comma-separated list
  runtime?: string; // e.g. "120 min"
  genre?: string; // Comma-separated list
  imdbRating?: string;
  imdbId?: string;
  trailer?: string; // YouTube URL
};

// ==================== Event Types ====================

/**
 * Event entity
 * Represents a film screening or watch party
 */
export type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string; // ISO 8601 datetime
  location: string | null;
  onlineLink: string | null;
  movieId: string | null;
  movieData: MovieData | null;
  maxCapacity: number | null;
  // Payment fields
  price: number | null; // In cents (e.g., 500 = £5.00)
  payWhatYouCan: boolean;
  minPrice: number | null; // Minimum price for PWYC (in cents)
  // Meta
  createdById: string;
  createdAt: string;
  updatedAt: string;
};

// ==================== RSVP Types ====================

/**
 * RSVP status enum
 * - going: Confirmed attendance (may require payment)
 * - interested: Bookmarked but not committed
 * - not_going: Cancelled attendance
 */
export type RSVPStatus = "going" | "interested" | "not_going";

/**
 * RSVP entity
 * Links users to events with attendance status
 */
export type RSVP = {
  id: string;
  userId: string;
  eventId: string;
  status: RSVPStatus;
  createdAt: string;
  updatedAt: string;
};

// ==================== Payment Types ====================

/**
 * Payment status enum matching Stripe states
 */
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

/**
 * Payment entity
 * Tracks Stripe payments for event tickets
 */
export type Payment = {
  id: string;
  userId: string;
  eventId: string;
  amount: number; // Amount in cents
  status: PaymentStatus;
  stripeId: string | null; // Stripe PaymentIntent ID
  createdAt: string;
  updatedAt: string;
};
