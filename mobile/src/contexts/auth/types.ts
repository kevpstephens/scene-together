/*===============================================
 * Authentication Types
 * ==============================================
 * TypeScript definitions for authentication state and actions.
 * Defines user roles, profile structure, and context interface.
 * ==============================================
 */

import { Session, User } from "@supabase/supabase-js";

export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  userRole: UserRole | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserRole: () => Promise<void>;
};
