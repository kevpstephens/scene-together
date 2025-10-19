/*===============================================
 * Session Manager
 * ==============================================
 * Handles user profile fetching and role management.
 * Fetches user data from the backend API using authenticated requests.
 * ==============================================
 */

import { supabase } from "../../lib/supabase";
import { api } from "../../services/api";
import type { UserProfile, UserRole } from "./types";

/**
 * Fetch user profile and role from the API
 * @param accessToken - Optional access token to use (avoids refetching session)
 * @returns User profile and role, or null if not authenticated
 */
export async function fetchUserRole(
  accessToken?: string
): Promise<{ profile: UserProfile | null; role: UserRole | null }> {
  try {
    let token = accessToken;

    // Only fetch session if token not provided
    if (!token) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      token = session?.access_token;
    }

    if (!token) {
      return { profile: null, role: null };
    }

    const response = await api.get("/auth/me");
    return {
      profile: response.data,
      role: response.data.role,
    };
  } catch (error: any) {
    console.error("Failed to fetch user role:", error);

    // Only clear role if it's an auth error
    if (error?.response?.status === 401) {
      return { profile: null, role: null };
    }

    // Default to USER role for other errors (network issues, etc.)
    return { profile: null, role: "USER" };
  }
}
