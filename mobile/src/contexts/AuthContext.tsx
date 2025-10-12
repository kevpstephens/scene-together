import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { api } from "../services/api";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";

// Required for OAuth to work properly
WebBrowser.maybeCompleteAuthSession();

type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type AuthContextType = {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserRole = async (accessToken?: string) => {
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
        setUserProfile(null);
        setUserRole(null);
        return;
      }

      const response = await api.get("/auth/me");
      setUserProfile(response.data);
      setUserRole(response.data.role);
    } catch (error: any) {
      console.error("Failed to fetch user role:", error);

      // Only default to USER if it's not an auth error
      if (error?.response?.status === 401) {
        console.log("🔐 AuthContext: Unauthorized - clearing role");
        setUserProfile(null);
        setUserRole(null);
      } else {
        // Default to USER role for other errors (network, etc)
        console.log("🔐 AuthContext: Error fetching role, defaulting to USER");
        setUserRole("USER");
      }
    }
  };

  useEffect(() => {
    console.log("🔐 AuthContext: Initializing...");

    // Safety timeout - ensure loading doesn't hang forever
    const timeoutId = setTimeout(() => {
      console.log("⏰ AuthContext: Timeout reached, forcing loading to false");
      setLoading(false);
    }, 5000);

    // Get initial session
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        console.log(
          "🔐 AuthContext: Session check complete",
          session ? "✅ Authenticated" : "❌ Not authenticated"
        );
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user && session?.access_token) {
          await refreshUserRole(session.access_token);
        }

        clearTimeout(timeoutId);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ AuthContext: Error getting session:", error);
        clearTimeout(timeoutId);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log(
        "🔐 AuthContext: Auth state changed",
        _event,
        session ? "✅ Authenticated" : "❌ Not authenticated"
      );
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

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
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

    // User profile will be created automatically by Supabase database trigger
    // Fetch user role after successful sign up
    if (data.session) {
      await refreshUserRole();
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch user role after successful sign in
    await refreshUserRole();
  };

  const signInWithGoogle = async () => {
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
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

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
  };

  const signOut = async () => {
    console.log("🔐 [AuthContext] Signing out...");

    // Clear local state immediately for instant feedback
    console.log("🔐 [AuthContext] Clearing local session state...");
    setSession(null);
    setUser(null);
    setUserProfile(null);
    setUserRole(null);

    // Try to sign out from Supabase in the background with a short timeout
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Sign out timeout")), 1000);
      });

      const { error } = (await Promise.race([
        supabase.auth.signOut(),
        timeoutPromise,
      ])) as { error: any };

      if (error) {
        console.warn("⚠️ [AuthContext] Supabase sign out error:", error);
      } else {
        console.log("✅ [AuthContext] Supabase sign out successful");
      }
    } catch (error: any) {
      console.warn(
        "⚠️ [AuthContext] Supabase sign out timeout:",
        error?.message || error
      );
    }

    console.log("✅ [AuthContext] Sign out complete");
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
