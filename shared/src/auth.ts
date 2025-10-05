import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { AuthUser } from "./types";

/**
 * Create a Supabase client for browser/mobile (using anon key)
 */
export function createSupabaseClient(
  supabaseUrl: string,
  supabaseAnonKey: string
): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Create a Supabase client for server-side (using service role key)
 * WARNING: Only use this in backend API, never in frontend!
 */
export function createSupabaseServerClient(
  supabaseUrl: string,
  supabaseServiceKey: string
): SupabaseClient {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Extract user info from Supabase session
 */
export function getUserFromSession(session: any): AuthUser | null {
  if (!session?.user) return null;

  return {
    id: session.user.id,
    email: session.user.email || "",
    role: (session.user.user_metadata?.role as "member" | "staff") || "member",
  };
}

/**
 * Check if user has staff role
 */
export function isStaff(user: AuthUser | null): boolean {
  return user?.role === "staff";
}
