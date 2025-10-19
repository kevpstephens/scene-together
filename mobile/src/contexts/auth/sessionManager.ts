/**
 * Session management logic
 * Handles user profile fetching and role management
 */

import { supabase } from "../../lib/supabase";
import { api } from "../../services/api";
import type { UserProfile, UserRole } from "./types";

/**
 * Fetch user profile and role from the API
 * @param accessToken - Optional access token to use
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
      console.log("🔐 AuthContext: No session token available");
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
      console.log("🔐 AuthContext: Unauthorized - clearing role");
      return { profile: null, role: null };
    }

    // Default to USER role for other errors (network, etc)
    console.log("🔐 AuthContext: Error fetching role, defaulting to USER");
    return { profile: null, role: "USER" };
  }
}
