/*===============================================
 * Authentication Actions
 * ==============================================
 * Core authentication operations including:
 * - Email/password sign up and sign in
 * - Google OAuth flow
 * - Sign out with timeout protection
 * ==============================================
 */

import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import { supabase } from "../../lib/supabase";

/**
 * Sign up a new user with email and password
 * @param email - User email
 * @param password - User password
 * @param name - Optional display name
 */
export async function signUpUser(
  email: string,
  password: string,
  name?: string
): Promise<void> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: "member", // Default role
      },
    },
  });

  if (error) throw error;
}

/**
 * Sign in an existing user with email and password
 * @param email - User email
 * @param password - User password
 */
export async function signInUser(
  email: string,
  password: string
): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
}

/**
 * Sign in with Google OAuth
 * Opens browser for OAuth flow and handles token exchange
 */
export async function signInWithGoogleOAuth(): Promise<void> {
  try {
    // Create a random state for PKCE
    const state = Crypto.randomUUID();

    // Get the redirect URL (where to return after OAuth)
    const redirectUrl = AuthSession.makeRedirectUri({
      scheme: "scenetogether",
      path: "auth/callback",
    });

    // Build the authorization URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    // Open the OAuth URL in browser
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    if (result.type === "success") {
      // Extract the tokens from the URL
      const url = result.url;
      const params = new URLSearchParams(url.split("#")[1]);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        // Set the session with the tokens
        const { error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (sessionError) throw sessionError;
      }
    }
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
}

/**
 * Sign out the current user
 * Includes timeout protection to prevent hanging on slow connections
 */
export async function signOutUser(): Promise<void> {
  // Try to sign out from Supabase with a short timeout
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Sign out timeout")), 1000);
    });

    const { error } = (await Promise.race([
      supabase.auth.signOut(),
      timeoutPromise,
    ])) as { error: any };

    if (error) {
      console.warn("Supabase sign out error:", error);
    }
  } catch (error: any) {
    console.warn("Supabase sign out timeout:", error?.message || error);
  }
}
