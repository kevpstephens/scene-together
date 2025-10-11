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

type AuthContextType = {
  session: Session | null;
  user: User | null;
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
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserRole = async () => {
    try {
      const response = await api.get("/auth/me");
      setUserRole(response.data.role);
    } catch (error) {
      console.error("Failed to fetch user role:", error);
      // Default to USER role if fetch fails but user is authenticated
      setUserRole("USER");
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

        if (session?.user) {
          await refreshUserRole();
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

      if (session?.user) {
        await refreshUserRole();
      } else {
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
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
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
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("❌ [AuthContext] Sign out error:", error);
      throw error;
    }
    // Clear local state immediately
    setSession(null);
    setUser(null);
    setUserRole(null);
    console.log("✅ [AuthContext] Sign out successful");
  };

  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
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
