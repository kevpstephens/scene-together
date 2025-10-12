import axios from "axios";
import { supabase } from "../lib/supabase";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000",
});

// Cache the access token to avoid async calls in interceptor (which can hang on web)
let cachedAccessToken: string | null = null;

// Initialize token cache from Supabase
supabase.auth.getSession().then(({ data: { session } }) => {
  cachedAccessToken = session?.access_token || null;
});

// Listen for auth changes to keep token cache updated
supabase.auth.onAuthStateChange((_event, session) => {
  cachedAccessToken = session?.access_token || null;
});

// Add auth token to every request
api.interceptors.request.use(
  async (config) => {
    // If no cached token, try to get it from Supabase session
    if (!cachedAccessToken) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      cachedAccessToken = session?.access_token || null;
    }

    if (cachedAccessToken) {
      config.headers.Authorization = `Bearer ${cachedAccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 and haven't retried yet, try refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get fresh session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.access_token) {
          cachedAccessToken = session.access_token;

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // Clear cached token on refresh failure
        cachedAccessToken = null;
      }
    }

    return Promise.reject(error);
  }
);
