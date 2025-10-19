/*===============================================
 * Authentication Context
 * ==============================================
 * Provides global authentication state and actions.
 * Manages Supabase session, user profile, and role-based access.
 * Automatically syncs auth state changes across the app.
 * ==============================================
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../../lib/supabase";
import { UserRole, UserProfile, AuthContextType } from "./types";
import { fetchUserRole } from "./sessionManager";
import {
  signUpUser,
  signInUser,
  signInWithGoogleOAuth,
  signOutUser,
} from "./authActions";

// Required for OAuth to work properly
WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * Wraps the app to provide auth state and actions
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Refresh user profile and role from API
   */
  const refreshUserRole = async (accessToken?: string) => {
    const { profile, role } = await fetchUserRole(accessToken);
    setUserProfile(profile);
    setUserRole(role);
  };

  /**
   * Initialize auth state and listen for changes
   */
  useEffect(() => {
    // Safety timeout - ensure loading doesn't hang forever
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);

    // Get initial session
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user && session?.access_token) {
          await refreshUserRole(session.access_token);
        }

        clearTimeout(timeoutId);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting session:", error);
        clearTimeout(timeoutId);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user && session?.access_token) {
        await refreshUserRole(session.access_token);
      } else {
        setUserProfile(null);
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign up a new user with email and password
   */
  const signUp = async (email: string, password: string, name?: string) => {
    await signUpUser(email, password, name);
    // User profile created automatically by Supabase database trigger
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      await refreshUserRole();
    }
  };

  /**
   * Sign in an existing user
   */
  const signIn = async (email: string, password: string) => {
    await signInUser(email, password);
    await refreshUserRole();
  };

  /**
   * Sign in with Google OAuth
   */
  const signInWithGoogle = async () => {
    await signInWithGoogleOAuth();
  };

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    // Clear local state immediately for instant feedback
    setSession(null);
    setUser(null);
    setUserProfile(null);
    setUserRole(null);

    // Sign out from Supabase
    await signOutUser();
  };

  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userProfile,
        userRole,
        loading,
        isAdmin,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        refreshUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
